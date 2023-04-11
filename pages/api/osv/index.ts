// import { Account, Osv } from '@prisma/client';
// import prisma from 'lib/prisma';
// import { NextApiRequest, NextApiResponse } from 'next';

// export const config = {
//     api: {
//         bodyParser: {
//             sizeLimit: '500mb'
//         }
//     }
// }

// export default async function handler(req: NextApiRequest, res:NextApiResponse) {
//     try{
//         if(req.method === 'GET'){
//             const { acc, stock, mrp } = req.query
//             const data = await prisma.osv.findMany({
//                 where: {
//                     acc: acc ? String(acc) : undefined,
//                     stock: 
//                     stock ? {
//                         equals: String(stock),
//                         mode: 'insensitive'
//                     } : undefined,
//                     mrp: mrp ? {
//                         equals: String(mrp),
//                         mode: 'insensitive'
//                     } : undefined
//                 }
//             })
//             return res.status(200).json(data);
//         }
//         if(req.method === 'POST'){
//             // const { token } =JSON.parse(req.body)
//             // const { body } = JSON.parse(req.body)
//             const { token } = req.body
//             const { body } = req.body
//             const { acc } = req.body
//             if( token !== process.env.TOKEN){
//                 throw new Error('Доступ запрещен')
//             }

//             await prisma.upd.create({
//                 data: {
//                     datetime: new Date()
//                 }
//             })
//             await prisma.account.deleteMany({
//                 where: {
//                     acc: acc
//                 }
//             })
//             const { count: added_account } = await prisma.account.createMany({
//                 data: body.map(el => ({ acc: el.acc, desc: el.acc_name })),
//                 skipDuplicates: true,
//             })
//             await prisma.mrp.deleteMany({
//                 where: {
//                     acc: acc
//                 }
//             })
//             const { count: added_mrp } = await prisma.mrp.createMany({
//                 data: body.map(el => ({ name: el.mrp, acc: el.acc })),
//                 skipDuplicates: true,
//             })
//             await prisma.stock.deleteMany({
//                 where: {
//                     acc: acc
//                 }
//             })
//             const { count: added_stock } = await prisma.stock.createMany({
//                 data: body.map(el => ({ name: el.stock, acc: el.acc })),
//                 skipDuplicates: true,
//             })
//             await prisma.osv.deleteMany({
//                 where: {
//                     acc: acc
//                 }
//             })
//             const { count: added_materials } = await prisma.osv.createMany({
//                 data: body.map(el => ({ name: el.name, bp: el.bp, acc: el.acc, acc_desc: el.acc_name, stock: el.stock, mrp: el.mrp, unit: el.unit, qty: el.qty }))
//             })
//             return res.status(200).json({ added_account, added_mrp, added_stock, added_materials });
//         }
//     }catch(e){
//         return res.status(500).send(e.message);
//     }
// }