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
        const {name, authorId, description, date, expireDate, partnerId} = JSON.parse(req.body)
        if(!name || !authorId || !description || !date || !expireDate || !partnerId) throw new Error('Указаны не все данные.')
        const data = await prisma.contract.create({
            data: {
                name: String(name),
                authorId: Number(authorId),
                description: description ? String(description) : undefined,
                date: new Date(date),
                expireDate: expireDate ? new Date(expireDate) : undefined,
                partnerId: Number(partnerId),
            }
        })
        res.status(200).json(data);
    }catch(e){
        res.status(500).json(e.message);
    }
}