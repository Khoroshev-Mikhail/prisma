import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb'
        },
        responseLimit: false,
    }
}

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        if(req.method === 'GET'){
            const { acc, stock, mrp } = req.query
            const data = await prisma.osv.findMany({
                where: {
                    acc: acc ? String(acc) : undefined,
                    stock: 
                    stock ? {
                        equals: String(stock),
                        mode: 'insensitive'
                    } : undefined,
                    mrp: mrp ? {
                        equals: String(mrp),
                        mode: 'insensitive'
                    } : undefined
                }
            })
            return res.status(200).json(data);
        }
        if(req.method === 'POST'){
            // const { token } =JSON.parse(req.body)
            // const { body } = JSON.parse(req.body)
            const { token } = req.body
            const { body } = req.body
            // const { isDelete } = req.body
            if( token !== process.env.TOKEN){
                throw new Error('Доступ запрещен')
            }
            if(req.body.isDelete){
                await prisma.account.deleteMany()
                await prisma.mrp.deleteMany()
                await prisma.stock.deleteMany()
                await prisma.osv.deleteMany()
            }
            await prisma.upd.create({
                data: {
                    datetime: new Date()
                }
            })
            const { count: added_account } = await prisma.account.createMany({
                data: body.map(el => ({ acc: el.acc, desc: el.acc_name })),
                skipDuplicates: true,
            })
            const { count: added_mrp } = await prisma.mrp.createMany({
                data: body.map(el => ({ name: el.mrp })),
                skipDuplicates: true,
            })
            const { count: added_stock } = await prisma.stock.createMany({
                data: body.map(el => ({ name: el.stock })),
                skipDuplicates: true,
            })
            const { count: added_materials } = await prisma.osv.createMany({
                data: body.map(el => ({ name: el.name, bp: el.bp, acc: el.acc, acc_desc: el.acc_name, stock: el.stock, mrp: el.mrp, unit: el.unit, qty: el.qty }))
            })
            return res.status(200).json({ added_account, added_mrp, added_stock, added_materials });
        }
    }catch(e){
        return res.status(500).send(e.message);
    }
}