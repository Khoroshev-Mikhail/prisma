import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '100mb'
        }
    }
}

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        if(req.method === 'GET'){
            const { acc } = req.query
            const data = await prisma.account.findMany({
                where: {
                    acc: acc && !Array.isArray(acc) ? acc : undefined,
                }
            })
            return res.status(200).json(data);
        }
    }catch(e){
        return res.status(500).send(e.message);
    }
}