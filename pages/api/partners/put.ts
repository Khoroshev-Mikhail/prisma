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
        const {id, inn, form, name, authorId} = JSON.parse(req.body)
        if(!id) throw new Error('Не указан Id.')
        const data = await prisma.partner.update({
            where: {
                id: Number(id)
            },
            data: {
                inn: inn ? String(inn) : undefined,
                form: form ? String(form) : undefined,
                name: name ? String(name) : undefined,
                authorId: authorId ? Number(authorId) : undefined
            }
        })
        res.status(200).json(data);
    }catch(e){
        res.status(500).json(e.message);
    }
}