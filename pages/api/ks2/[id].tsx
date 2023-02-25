import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import prisma from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        if(req.method === "GET"){
            const {id} = req.query
            if(!id) throw new Error('Не указан id.')
            const data = await prisma.ks2.findUnique({
                where: {
                    id: Number(id),
                },
                include: {
                    ks3: {
                        select: {
                        id: true,
                        date: true,
                        name: true,
                        _count: true
                        },
                    }
                }
            })
            res.status(200).json(data);
            return;
        }
        if(req.method === "PUT"){
            const session = await getServerSession(req, res, authOptions)
            if(!session) {
                res.status(401).json('Не авторизирован.');
                return;
            }
            const {id, name, date, updatedAt, ks3Id, email, rejected, accepted, comment} = JSON.parse(req.body)
            if(!id || !email) throw new Error('Не указан Id или автор обновления.')

            const {id: authorId} = await prisma.user.findUnique({
                where: {
                    email: String(email)
                }
            })        
            if(!authorId) throw new Error('Не указан автор.')

            const data = await prisma.ks2.update({
                where: {
                    id: Number(id)
                },
                data: {
                    name: name ? String(name) : undefined,
                    date: date ? String(date) : undefined,
                    updatedAt: new Date(),
                    ks3Id: ks3Id ? Number(ks3Id) : undefined,
                    authorId: authorId ? Number(authorId) : undefined,
                    rejected:  rejected ? !!rejected : undefined,
                    accepted: accepted ? !!accepted : undefined,
                    comment: comment ? String(comment) : undefined,
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
            const {id} = JSON.parse(req.body)
            if(!id) throw new Error('Не указан Id.')
    
            const data = await prisma.ks2.delete({
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