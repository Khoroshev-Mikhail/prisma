import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import prisma from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        if(req.method === "GET"){
            const {id, name, date, createdAt, contractId, authorId, rejected, accepted, comment} = req.query
            const data = await prisma.ks3.findMany({
                where: {
                    id: id ? Number(id) : undefined,
                    name: name ? String(name) : undefined,
                    date: date ? String(date) : undefined,
                    createdAt: createdAt ? String(createdAt) : undefined,
                    contractId: contractId ? Number(contractId) : undefined,
                    authorId: authorId ? Number(authorId) : undefined,
                    rejected:  rejected ? !!rejected : undefined,
                    accepted: accepted ? !!accepted : undefined,
                    comment: comment ? String(comment) : undefined,
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
            res.status(200).json(data);
            return;
        }
        if(req.method === "POST"){
            const session = await getServerSession(req, res, authOptions)
            if(!session) {
                res.status(401).json('Не авторизирован.');
                return;
            }
            const {name, date, contractId, email, rejected, accepted, comment} = JSON.parse(req.body)
            if(!name || !date || !contractId || !email) throw new Error('Указаны не все данные.')

            const {id: authorId} = await prisma.user.findUnique({
                where: {
                    email: String(email)
                }
            })        
            if(!authorId) throw new Error('Не указан автор.')

            const data = await prisma.ks3.create({
                data: {
                    name: String(name),
                    date: String(date),
                    contractId: Number(contractId),
                    authorId: Number(authorId),
                    rejected: !!rejected || undefined,
                    accepted: !!accepted || undefined,
                    comment: String(comment) || undefined
                }
            })
            res.status(200).json(data);
            return
        }
        if(req.method === "PUT"){
            const session = await getServerSession(req, res, authOptions)
            if(!session) {
                res.status(401).json('Не авторизирован.');
                return;
            }
            const {id, name, date, updatedAt, contractId, email, rejected, accepted, comment} = JSON.parse(req.body)
            if(!id || !email) throw new Error('Не указан Id или автор обновления.')

            const {id: authorId} = await prisma.user.findUnique({
                where: {
                    email: String(email)
                }
            })        
            if(!authorId) throw new Error('Не указан автор.')

            const data = await prisma.ks3.update({
                where: {
                    id: Number(id)
                },
                data: {
                    name: name ? String(name) : undefined,
                    date: date ? String(date) : undefined,
                    updatedAt: new Date(),
                    contractId: contractId ? Number(contractId) : undefined,
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
    
            const data = await prisma.ks3.delete({
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