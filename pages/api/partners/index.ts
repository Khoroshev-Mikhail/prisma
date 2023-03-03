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
            const session = await getServerSession(req, res, authOptions)
            if(!session) {
                res.status(401).json('Не авторизирован.');
                return;
            }

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
            
            const {inn, form: formCompany, name, email, contacts} = fields
            if(!inn || !form || !name || !email) throw new Error('Указаны не все данные.')

            const {id: authorId} = await prisma.user.findUnique({
                where: {
                    email: String(email)
                }
            })        
            if(!authorId) throw new Error('Не указан автор.')

            const data = await prisma.partner.create({
                data: {
                    inn: String(inn),
                    name: String(name),
                    form: String(formCompany),
                    contacts: contacts ? String(contacts) : undefined,
                    authorId: Number(authorId),
                }
            })
            res.status(200).json(data);
            return;
        }
    }catch(e){
        res.status(500).json(e.message);
    }
}