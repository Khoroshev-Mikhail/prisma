import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import prisma from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
        if(req.method === 'GET'){
            const {id} = req.query
            if(!id) throw new Error('Не указан id.')
            const data = await prisma.partner.findUnique({
                where: {
                    id: Number(id),
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
            const {id, inn, form, name, email} = JSON.parse(req.body)
            if(!id || !email) throw new Error('Указаны не все данные.')

            const {id: authorId} = await prisma.user.findUnique({
                where: {
                    email: String(email)
                }
            })        
            if(!authorId) throw new Error('Не указан автор.')

            const data = await prisma.partner.update({
                where: {
                    id: Number(id)
                },
                data: {
                    inn: inn ? String(inn) : undefined,
                    form: form ? String(form) : undefined,
                    name: name ? String(name) : undefined,
                    authorId: Number(authorId)
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
        res.status(500).json(e.message);
    }
}