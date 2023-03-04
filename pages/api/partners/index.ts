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
            const {inn, name, sortBy, orderBy} = req.query
            if(sortBy != undefined && !['id', 'name', 'inn'].includes(String(sortBy))) throw new Error('Невозможная сортировка')
            const data = await prisma.partner.findMany({
                where: {
                    inn: {
                        contains: inn ? String(inn) : undefined,
                        mode: 'insensitive'
                    },
                    name: {
                        contains: name ? String(name) : undefined,
                        mode: 'insensitive'
                    },
                },
                orderBy: {
                    id: sortBy === 'id' ? (orderBy === 'asc' ? 'asc' : 'desc') : undefined, 
                    name: sortBy === 'name' ? (orderBy === 'asc' ? 'asc' : 'desc') : undefined, 
                    inn: sortBy === 'inn' ? (orderBy === 'asc' ? 'asc' : 'desc') : undefined, 
                }
            })
            res.status(200).json(data);
            return;
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
            
            const {inn, form: formCompany, name, contacts} = fields
            if(!inn || !formCompany || !name) throw new Error('Указаны не все данные.')

            const data = await prisma.partner.create({
                data: {
                    inn: String(inn),
                    name: String(name),
                    form: String(formCompany),
                    contacts: contacts ? String(contacts) : undefined,
                    authorId: Number(userId),
                }
            })
            return res.status(200).json(data);
        }
    }catch(e){
        return res.status(500).json(e.message);
    }
}