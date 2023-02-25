import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import prisma from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        if(req.method === "GET"){
            const {id, name, date, createdAt, updatedAt, ks3Id, authorId, rejected, accepted, comment} = req.query
            const data = await prisma.ks2.findMany({
                where: {
                    id: id ? Number(id) : undefined,
                    name: name ? String(name) : undefined,
                    date: date ? String(date) : undefined,
                    createdAt: createdAt ? String(createdAt) : undefined,
                    updatedAt: updatedAt ? String(updatedAt) : undefined,
                    ks3Id: ks3Id ? Number(ks3Id) : undefined,
                    authorId: authorId ? Number(authorId) : undefined,
                    rejected:  rejected ? !!rejected : undefined,
                    accepted: accepted ? !!accepted : undefined,
                    comment: comment ? String(comment) : undefined,
                },
                include: {
                  ks3: {
                    select: {
                      id: true,
                      name: true,
                      date: true,
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
            const {name, date, ks3Id, email, rejected, accepted, comment} = JSON.parse(req.body)
            if(!name || !date || !ks3Id || !email) throw new Error('Указаны не все данные.')

            const {id: authorId} = await prisma.user.findUnique({
                where: {
                    email: String(email)
                }
            })        
            if(!authorId) throw new Error('Не указан автор.')

            const data = await prisma.ks2.create({
                data: {
                    name: String(name),
                    date: String(date),
                    ks3Id: Number(ks3Id),
                    authorId: Number(authorId),
                    rejected: !!rejected || undefined,
                    accepted: !!accepted || undefined,
                    comment: String(comment) || undefined
                }
            })
            res.status(200).json(data);
            return
        }
    }catch(e){
        res.status(500).json(e.message);
    }
}