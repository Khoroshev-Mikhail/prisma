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
            
            const {name, description, date, expireDate, parentId, email, accepted } = fields
            if(!name || !date || !parentId || !email) throw new Error('Указаны не все данные.')

            const {id: authorId} = await prisma.user.findUnique({
                where: {
                    email: String(email)
                }
            })        
            if(!authorId) throw new Error('Не указан автор.')

            const data = await prisma.contract.create({
                data: {
                    name: String(name),
                    description: description ? String(description) : undefined,
                    date: String(date),
                    expireDate: expireDate ? String(expireDate) : undefined,
                    partnerId: Number(parentId),
                    authorId: Number(authorId),
                    accepted: accepted ? !!accepted : undefined,
                }
            })
            res.status(200).json(data);
            return
        }
    }catch(e){
        res.status(500).json(e.message);
    }
}