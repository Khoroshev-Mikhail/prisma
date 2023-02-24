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
        const {id} = JSON.parse(req.body)
        if(!id) throw new Error('Не указан Id.')

        const data = await prisma.contract.delete({
            where: {
                id: Number(id)
            }
        })
        res.status(200).json(data);
    }catch(e){
        res.status(500).json(e.message);
    }
}