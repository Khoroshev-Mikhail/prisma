import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '100mb' // Set desired value here
        }
    }
}

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        if(req.method === 'GET'){
            const data = await prisma.osv.findMany()
            return res.status(200).send(data);
        }
        if(req.method === 'POST'){
            // const { token } =JSON.parse(req.body)
            const { token } = req.body
            // const { body } = JSON.parse(req.body)
            const { body } = req.body

            // if( token !== process.env.TOKEN){
            //     throw new Error('Доступ запрещен')
            // }

            await prisma.osv.deleteMany({})
            await prisma.account.deleteMany({})
            await prisma.mrp.deleteMany({})

            const account = await prisma.account.createMany({
                data: body.map(el => el.acc),
                skipDuplicates: true,
            })
            //mrp - materially responsible person
            const mol = await prisma.mrp.createMany({
                data: body.map(el => el.mrp),
                skipDuplicates: true,
            })
            //Нужно ли здесь создавать добавлять связи? протестируй как быстрее извлекается, если обращается по связи или просто фильтрует по строке mrp | acc
            //UPD вроде при использовании метода createMany нельзя создавать связи
            const data = await prisma.osv.createMany({
                data: body
            })
            return res.status(200).json(data);
        }
    }catch(e){
        return res.status(500).send(e.message);
    }
}