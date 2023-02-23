import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        // const {email, password} = JSON.parse(req.body)
        const {email, password} = req.query
        const user = await prisma.user.findUnique({
            where: {
                email: email ? String(email) : undefined
            }
        })
        if(user.password !== password) throw new Error('Не верный пароль.')
        res.status(200).json(user);
    }catch(e){
        res.status(500).json(e.message);
    }
}