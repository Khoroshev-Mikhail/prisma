import { getServerSession } from 'next-auth';
import prisma from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';
import formidable from "formidable";
import { ACCEPTED_ROLES, UPDATED_ROLES } from '../../../lib/constants';

export const config = {
    api: {
        bodyParser: false
    }
};

export default async function handler(req, res) {
    try{
        if(req.method === "GET"){
            const {name, parentId, accepted, comment, sortBy, orderBy} = req.query
            if(sortBy != undefined && !['id', 'name', 'accepted'].includes(String(sortBy))) throw new Error('Невозможная сортировка')
            const data = await prisma.ks3.findMany({
                where: {
                    name: {
                        contains: name ? String(name) : undefined,
                        mode: 'insensitive'
                    },
                    contractId: {
                        equals: parentId ? Number(parentId) : undefined
                    },
                    //Проблема фильтра по датам заключается в том, что: даты хранятся с часами, минутами и секундами и более. Дата 01.01.23-00-00-00 после метода toJSON вернет строку 31.12.2022-21-00-00 для московского времени! ПОТОМУ ЧТО МОСКВА ЮТС + 3
                    accepted: {
                        equals: (accepted === '' || !accepted || accepted === 'undefined') ? undefined : (accepted === 'true' ? true : accepted === 'false' ? false : null),
                    },
                    comment: comment ? String(comment) : undefined,
                },
                orderBy: {
                    id: sortBy === 'id' ? (orderBy === 'asc' ? 'asc' : 'desc') : undefined, 
                    name: sortBy === 'name' ? (orderBy === 'asc' ? 'asc' : 'desc') : undefined, 
                },
                include: {
                  contract: {
                    select: {
                      id: true,
                      name: true,
                      date: true,
                      _count: true
                    },
                  }
                }
            })
            return res.status(200).json(data);
        }
        if(req.method === "POST"){
            const {user: {id : userId, role}} = await getServerSession(req, res, authOptions)
            if(!userId || !role) return res.status(401).json('Не авторизован.')
            if(!UPDATED_ROLES.includes(role)) return res.status(403).json('Нет прав для совершения операции.')

            const form = await formidable({ multiples: true });
            const formData: Promise<{fields: any, files?: File}> = new Promise((resolve, reject) => {
              form.parse(req, async (err, fields, files) => {
                if (err) {
                  reject("error");
                }
                resolve({ fields, files });
              });
            });
            const { fields, files } = await formData;
            
            const {name, date, parentId, accepted, comment} = fields
            if(!name || !date || !parentId) throw new Error('Указаны не все данные.')

            if(accepted && !ACCEPTED_ROLES.includes(role)) return res.status(403).json('Нет прав для создания документа с уже установленным статусом (принят / отклонён).')
            const data = await prisma.ks3.create({
                data: {
                    name: String(name),
                    date: String(date),
                    contractId: Number(parentId),
                    authorId: Number(userId),
                    accepted: accepted ? !!accepted : undefined,
                    comment: comment ? String(comment) : undefined,
                }
            })
            return res.status(200).json(data);
        }
    }catch(e){
        return res.status(500).json(e.message);
    }
}