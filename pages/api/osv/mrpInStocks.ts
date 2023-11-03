import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const { stocks, mrps } = req.query;
            const stockArray = Array.isArray(stocks) ? stocks : [stocks]; // Преобразовать в массив, если не является массивом
            // const stockArray = ["АБЗ Строит уч№4 (ОП УС№2 Москва-Казань с.Кетрось)","АБЗ Строит уч№4 (ОП УС№3 Москва-Казань с.Яново)","Административно-хозяйственный отдел"]; // Преобразовать в массив, если не является массивом


            const data = await prisma.osv.findMany({
                where: {
                    stock: {
                        in: stockArray
                    }
                },
                select: {
                    mrp: true
                },
                distinct: ['mrp']
            });

            return res.status(200).json(data);
        }
    } catch (e) {
        return res.status(500).send(e.message);
    }
}