import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        if(req.method === 'GET'){
            const { name } = req.query
            if(name && name !== ''){
                const data = await prisma.stock.findMany({
                    where: {
                        name: {
                            contains: name ? String(name) : undefined,
                            mode: 'insensitive',
                        }
                    },
                    take: 5
                })
                return res.status(200).json(data);
            }

            const data = await prisma.stock.findMany()
            return res.status(200).json(data);
        }
    }catch(e){
        return res.status(500).send(e.message);
    }
}