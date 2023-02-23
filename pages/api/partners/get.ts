import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        const {id, inn, name, authorId} = req.query
        const partner = await prisma.partner.findMany({
            where: {
                id: id ? Number(id) : undefined,
                inn: inn ? String(inn) : undefined,
                name: name ? String(name) : undefined,
                authorId: authorId ? Number(authorId) : undefined
            }
        })
        res.status(200).json(partner);
    }catch(e){
        res.status(500).json(req.query);
    }
}