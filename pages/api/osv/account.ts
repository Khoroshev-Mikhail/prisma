import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        if(req.method === 'GET'){
            const { acc } = req.query
            const data = await prisma.account.findMany({
                where: {
                    acc: acc ? String(acc) : undefined,
                }
            })
            return res.status(200).json(data);
        }
    }catch(e){
        return res.status(500).send(e.message);
    }
}