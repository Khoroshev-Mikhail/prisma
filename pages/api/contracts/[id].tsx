import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';
import formidable from "formidable";

export const config = {
    api: {
        bodyParser: false
    }
};

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        if(req.method === "GET"){
            const {id} = req.query
            if(!id) throw new Error('Не указан id.')
            const data = await prisma.contract.findUnique({
                where: {
                    id: Number(id),
                },
                include: {
                    partner: {
                        select: {
                          id: true,
                          form: true,
                          name: true,
                          _count: true
                        },
                      }
                }
            })
            res.status(200).json(data);
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

        if(req.method === "PUT"){
            const session = await getServerSession(req, res, authOptions)
            if(!session) {
                res.status(401).json('Не авторизирован.');
                return;
            }

            const {id, name, description, date, expireDate, partnerId, email, accepted,} = fields
            if(!id || !email) throw new Error('Не указан Id или автор обновления.')

            const {id: authorId} = await prisma.user.findUnique({
                where: {
                    email: String(email)
                }
            })        
            if(!authorId) throw new Error('Не указан автор.')

            const data = await prisma.contract.update({
                where: {
                    id: Number(id)
                },
                data: {
                    name: name ? String(name) : undefined,
                    description: description ? String(description) : undefined,
                    date: date ? String(date) : undefined,
                    expireDate: expireDate ? String(expireDate) : undefined,
                    updatedAt: new Date(),
                    partnerId: partnerId ? Number(partnerId) : undefined,
                    authorId: authorId ? Number(authorId) : undefined,
                    accepted: (accepted === '' || !accepted) ? undefined : (accepted === 'true' ? true : accepted === 'false' ? false : null),
                }
            })
            res.status(200).json(data);
            return;
        }
        if(req.method === "DELETE"){
            const session = await getServerSession(req, res, authOptions)
            if(!session) {
                res.status(401).json('Не авторизирован.');
                return;
            }
            const {id} = fields
            if(!id) throw new Error('Не указан Id.')
    
            const data = await prisma.contract.delete({
                where: {
                    id: Number(id)
                }
            })
            res.status(200).json(data);
            return;
        }
    }catch(e){
        res.status(500).json(e.message);
    }
}