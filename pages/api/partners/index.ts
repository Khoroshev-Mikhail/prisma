import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import prisma from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        if(req.method === "GET"){
            const {id, inn, name, authorId} = req.query
            const data = await prisma.partner.findMany({
                where: {
                    id: id ? Number(id) : undefined,
                    inn: inn ? String(inn) : undefined,
                    name: name ? String(name) : undefined,
                    authorId: authorId ? Number(authorId) : undefined
                }
            })
            res.status(200).json(data);
            return;
        }
        if(req.method === "POST"){
            const session = await getServerSession(req, res, authOptions)
            if(!session) {
                res.status(401).json('Не авторизирован.');
                return;
            }
            const {inn, form, name, authorId} = JSON.parse(req.body)
            if(!inn || !form || !name || !authorId) throw new Error('Указаны не все данные.')
            const data = await prisma.partner.create({
                data: {
                    inn: String(inn),
                    name: String(name),
                    form: String(form),
                    authorId: Number(authorId),
                }
            })
            res.status(200).json(data);
            return;
        }
        if(req.method === "PUT"){
            const session = await getServerSession(req, res, authOptions)
            if(!session) {
                res.status(401).json('Не авторизирован.');
                return;
            }
            const {id, inn, form, name, authorId} = JSON.parse(req.body)
            if(!id) throw new Error('Не указан Id.')
            const data = await prisma.partner.update({
                where: {
                    id: Number(id)
                },
                data: {
                    inn: inn ? String(inn) : undefined,
                    form: form ? String(form) : undefined,
                    name: name ? String(name) : undefined,
                    authorId: authorId ? Number(authorId) : undefined
                }
            })
            res.status(200).json(data);
            return;
        }
        if(req.method === "DELETE"){
            const session = await getServerSession(req, res, authOptions)
            if(!session) {
                res.status(401).json('Не авторизирован.');
                return;
            }
            const {id} = JSON.parse(req.body)
            if(!id) throw new Error('Не указан Id.')
    
            const data = await prisma.partner.delete({
                where: {
                    id: Number(id)
                }
            })
            res.status(200).json(data);
            return;
        }
    }catch(e){
        res.status(500).json(req.query);
    }
}