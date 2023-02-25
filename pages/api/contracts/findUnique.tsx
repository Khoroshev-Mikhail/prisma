import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        const {id} = req.query
        if(!id) throw new Error('Не указан id.')
        const data = await prisma.contract.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                partner: {
                    select: {
                      id: true,
                      form: true,
                      name: true,
                      _count: true
                    },
                  }
            }
        })
        res.status(200).json(data);
    }catch(e){
        res.status(500).json(e.message);
    }
}