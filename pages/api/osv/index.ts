import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        if(req.method === 'GET'){
            const data = await prisma.osv.findMany({
                select:{
                    date: true,
                    body: true
                },
                orderBy: {
                    date: 'desc'
                },
                take: 1
            })
            return res.status(200).send(data);
        }
        if(req.method === 'POST'){
            // const body = JSON.parse(req.body)
            const { body } = req
            const data = await prisma.osv.create({
                data: {
                    body: JSON.stringify(body)
                }
            })
            return res.status(200).json(data);
        }
    }catch(e){
        const data = await prisma.osv.create({
            data: {
                body: e.message
            }
        })
        return res.status(500).send(e.message);
    }
}