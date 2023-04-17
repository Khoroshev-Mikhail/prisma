import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        if(req.method === 'GET'){
            const { str } = req.query
            if(str && str !== ''){
                const data = await prisma.osv.findMany({
                    where: {
                        OR: [
                                {
                                    bp: {
                                    contains: String(str),
                                    mode: 'insensitive',
                                }},
                                {
                                    name: {
                                    contains: String(str),
                                    mode: 'insensitive',
                                }}
                        ]
                    },
                    take: 30
                })
                return res.status(200).json(data);
            }

            return res.status(200).json(null);
        }
    }catch(e){
        return res.status(500).send(e.message);
    }
}