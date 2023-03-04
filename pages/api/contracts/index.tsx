import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import prisma from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';
import formidable from "formidable";

export const config = {
    api: {
        bodyParser: false
    }
};

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        if(req.method === "GET"){
            const {id, name, parentId, authorId, accepted, sortBy, orderBy} = req.query
            const data = await prisma.contract.findMany({
                where: {
                    id: id ? Number(id) : undefined,
                    name: {
                        contains: name ? String(name) : undefined,
                        mode: 'insensitive'
                    },
                    partnerId: {
                        equals: parentId ? Number(parentId) : undefined
                    },
                    authorId: authorId ? Number(authorId) : undefined,
                    accepted: {
                        equals: (accepted === '' || !accepted || accepted === 'undefined') ? undefined : (accepted === 'true' ? true : accepted === 'false' ? false : null),
                    },
                },                
                orderBy: {
                    id: sortBy === 'id' ? (orderBy === 'asc' ? 'asc' : 'desc') : undefined, 
                    name: sortBy === 'name' ? (orderBy === 'asc' ? 'asc' : 'desc') : undefined, 
                },
                include: {
                  partner: {
                    select: {
                      id: true,
                      form: true,
                      name: true,
                      inn: true,
                      _count: true
                    },
                  }
                }
            })
            return res.status(200).json(data);
        }
        if(req.method === "POST"){
            const {user: {id : userId, accessLevel}} = await getServerSession(req, res, authOptions)
            if(!userId || !accessLevel) return res.status(401).json('Не авторизован.')
            if(accessLevel < 2) return res.status(403).json('Нет прав для совершения операции.')

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
            
            const {name, description, date, expireDate, parentId, accepted } = fields
            if(!name || !date || !parentId) throw new Error('Указаны не все данные.')

            const data = await prisma.contract.create({
                data: {
                    name: String(name),
                    description: description ? String(description) : undefined,
                    date: String(date),
                    expireDate: expireDate ? String(expireDate) : undefined,
                    partnerId: Number(parentId),
                    authorId: Number(userId),
                    accepted: accepted ? !!accepted : undefined,
                }
            })
            return res.status(200).json(data);
        }
    }catch(e){
        return res.status(500).json(e.message);
    }
}