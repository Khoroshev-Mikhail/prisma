import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        if(req.method === 'GET'){
            const { bp } = req.query
            if(bp && bp !== ''){
                const data = await prisma.osv.findMany({
                    where: {
                        bp: {
                            contains: String(bp),
                            mode: 'insensitive',
                        }
                    },
                    take: 15
                })
                return res.status(200).json(data);
            }

            return res.status(200).json(null);
        }
    }catch(e){
        return res.status(500).send(e.message);
    }
}