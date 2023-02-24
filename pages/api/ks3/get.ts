import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        const {id, name, date, createdAt, contractId, authorId, rejected, accepted, comment} = req.query
        const data = await prisma.ks3.findMany({
            where: {
                id: id ? Number(id) : undefined,
                name: name ? String(name) : undefined,
                date: date ? String(date) : undefined,
                createdAt: createdAt ? String(createdAt) : undefined,
                contractId: contractId ? Number(contractId) : undefined,
                authorId: authorId ? Number(authorId) : undefined,
                rejected:  rejected ? !!rejected : undefined,
                accepted: accepted ? !!accepted : undefined,
                comment: comment ? String(comment) : undefined,
            },
            include: {
              contract: {
                select: {
                  id: true,
                  name: true,
                  date: true,
                  _count: true
                },
              }
            }
        })
        res.status(200).json(data);
    }catch(e){
        res.status(500).json(req.query);
    }
}