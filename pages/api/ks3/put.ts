import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        const session = await getServerSession(req, res, authOptions)
        if(!session) {
            res.status(401).json('Не авторизирован.');
            return;
        }
        const {id, name, date, updatedAt, contractId, authorId, rejected, accepted, comment} = JSON.parse(req.body)
        if(!id) throw new Error('Не указан Id.')
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
    }catch(e){
        res.status(500).json(e.message);
    }
}