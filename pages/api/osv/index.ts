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
            const data = await prisma.osv.findMany()
            const instruction = `
                <h1>API</h1>
                <span>Get a array of objects with keys</span>
                <ul>
                    <li>acc?: string (Account)</li>
                    <li>acc_desc?: string (Account description)</li>
                    <li>mrp?: string (Matrtially responsible person)</li>
                    <li>name?: string (Name of material)</li>
                    <li>stock?: string (Material's stock)</li>
                    <li>unit?: string (Material'l unit)</li>
                    <li>qty?: string (Material'l quantity)</li>
                </ul>
            `
            return res.status(200).json(data);
        }
        if(req.method === 'POST'){
            // const { token } =JSON.parse(req.body)
            const { token } = req.body
            // const { body } = JSON.parse(req.body)
            const { body } = req.body

            // if( token !== process.env.TOKEN){
            //     throw new Error('Доступ запрещен')
            // }

            await prisma.account.deleteMany({})
            const account = await prisma.account.createMany({
                data: body.map(el => ({ name: el.acc, desc: el.desc })),
                skipDuplicates: true,
            })
            //mrp - materially responsible person
            await prisma.mrp.deleteMany({})
            const mol = await prisma.mrp.createMany({
                data: body.map(el => ({ name: el.mrp })),
                skipDuplicates: true,
            })
            //Нужно ли здесь создавать добавлять связи? протестируй как быстрее извлекается, если обращается по связи или просто фильтрует по строке mrp | acc
            //UPD вроде при использовании метода createMany нельзя создавать связи
            await prisma.osv.deleteMany({})
            const data = await prisma.osv.createMany({
                data: body
            })
            return res.status(200).json(data);
        }
    }catch(e){
        return res.status(500).send(e.message);
    }
}