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
        const {name, date, ks3Id, authorId, rejected, accepted, comment} = JSON.parse(req.body)
        if(!name || !date || !ks3Id || !authorId) throw new Error('Указаны не все данные.')
        const data = await prisma.ks2.create({
            data: {
                name: String(name),
                date: String(date),
                ks3Id: Number(ks3Id),
                authorId: Number(authorId),
                rejected: rejected ? !!rejected : undefined,
                accepted: accepted ? !!accepted : undefined,
                comment: comment ? String(comment) : undefined
            }
        })
        res.status(200).json(data);
    }catch(e){
        res.status(500).json(e.message);
    }
}