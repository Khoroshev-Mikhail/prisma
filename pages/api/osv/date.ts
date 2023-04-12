import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        if(req.method === 'GET'){
            const data = await prisma.upd.findMany({
                orderBy: {
                    datetime: 'desc'
                },
                take: 1
            })
            return res.status(200).json(data[0].datetime);
        }
    }catch(e){
        return res.status(500).send(e.message);
    }
}