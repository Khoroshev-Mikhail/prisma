import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        const {id, name, authorId, description, date, expireDate, partnerId} = req.query
        const data = await prisma.contract.findMany({
            where: {
                id: id ? Number(id) : undefined,
                name: name ? String(name) : undefined,
                authorId: authorId ? Number(authorId) : undefined,
                description: description ? String(description) : undefined,
                date: date ? String(date) : undefined,
                expireDate: expireDate ? String(expireDate) : undefined,
                partnerId: partnerId ? Number(partnerId) : undefined,
            },
            include: {
                partner: {
                  select: {
                    id: true,
                    form: true,
                    name: true,
                    _count: true
                  }
                }
              }
        })
        res.status(200).json(data);
    }catch(e){
        res.status(500).json(req.query);
    }
}