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
        const {inn, form, name, email} = JSON.parse(req.body)
        if(!inn || !form || !name || !email) throw new Error('Указаны не все данные.')

        const {id: authorId} = await prisma.user.findUnique({
            where: {
                email: String(email)
            }
        })        
        if(!authorId) throw new Error('Не указан автор.')

        const data = await prisma.partner.create({
            data: {
                inn: String(inn),
                name: String(name),
                form: String(form),
                authorId: Number(authorId),
            }
        })
        res.status(200).json(data);
    }catch(e){
        res.status(500).json(e.message);
    }
}