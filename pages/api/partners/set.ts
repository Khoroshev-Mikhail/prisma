import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        const {inn, form, name, authorId} = JSON.parse(req.body)
        if(!inn || !form || !name || !authorId) throw new Error('Указаны не все данные.')
        const ks2 = await prisma.partner.create({
            data: {
                inn: String(inn),
                name: String(name),
                form: String(form),
                authorId: Number(authorId),
            }
        })
        const result = {
            props: { 
                ks2 
            }
        }
        res.status(200).json(result);
    }catch(e){
        res.status(500).json(e.message);
    }
}