import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        const {id} = JSON.parse(req.body)
        if(!id) throw new Error('Не указан Id.')
        const ks2 = await prisma.partner.delete({
            where: {
                id: Number(id)
            }
        })
        const result = {
            props: { 
                ks2 
            }
        }
        res.status(200).json(result);
    }catch(e){
        res.status(500).json(e.message);
    }
}