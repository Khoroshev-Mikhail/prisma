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
        const {name, date, contractId, authorId, rejected, accepted, comment} = JSON.parse(req.body)
        if(!name || !date || !contractId || !authorId) throw new Error('Указаны не все данные.')
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
    }catch(e){
        res.status(500).json(e.message);
    }
}