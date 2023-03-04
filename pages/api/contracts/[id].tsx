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
            const {user: {id : userId, accessLevel}} = await getServerSession(req, res, authOptions)
            if(!userId || !accessLevel) return res.status(401).json('Не авторизован.')
            if(accessLevel < 2) return res.status(403).json('Нет прав для совершения операции.')
            
            const {id, name, description, date, expireDate, partnerId, accepted} = fields
            if(!id) throw new Error('Не указан id.') 

            if(accepted && accessLevel < 3) return res.status(403).json('Нет прав для совершения операции.')
            if(accepted && accessLevel >= 3){
                await prisma.contract.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        accepted: (accepted === '' || !accepted) ? undefined : (accepted === 'true' ? true : accepted === 'false' ? false : null),
                    }
                })
            }

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
                    authorId: Number(userId),
                }
            })
            return res.status(200).json(data);
        }
        if(req.method === "DELETE"){
            const {user: {id : userId, accessLevel}} = await getServerSession(req, res, authOptions)
            if(!userId || !accessLevel) return res.status(401).json('Не авторизован.')
            if(accessLevel < 2) return res.status(403).json('Нет прав для совершения операции.')
            
            const {id} = fields
            if(!id) throw new Error('Не указан Id.')
    
            const data = await prisma.contract.delete({
                where: {
                    id: Number(id)
                }
            })
            return res.status(200).json(data);
        }
    }catch(e){
        return res.status(500).json(e.message);
    }
}