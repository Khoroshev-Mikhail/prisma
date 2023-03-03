import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import prisma from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';
import formidable from "formidable";
import { UPDATED_ROLES } from '../../../lib/constants';

export const config = {
    api: {
        bodyParser: false
    }
};

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
            return res.status(200).json(data);
        }

        const form = await formidable({ multiples: true });
        const formData: Promise<{fields: any, files?: File}> = new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    reject("error");
                }
                resolve({ fields, files });
            });
        });
        const {fields, files} = await formData;

        if(req.method === "PUT"){
            const {user: {id : userId, role}} = await getServerSession(req, res, authOptions)
            if(!userId || !role) return res.status(401).json('Не авторизован.')
            if(!UPDATED_ROLES.includes(role)) return res.status(403).json('Нет прав для совершения операции.')

            const {id, inn, form, contacts, name, } = fields
            if(!id ) throw new Error('Указан id.')      
            const data = await prisma.partner.update({
                where: {
                    id: Number(id)
                },
                data: {
                    inn: inn ? String(inn) : undefined,
                    form: form ? String(form) : undefined,
                    name: name ? String(name) : undefined,
                    contacts: contacts ? String(contacts) : undefined,
                    authorId: Number(userId)
                }
            })
            return res.status(200).json(data);
        }
        if(req.method === "DELETE"){
            const {user: {id : userId, role}} = await getServerSession(req, res, authOptions)
            if(!userId || !role) return res.status(401).json('Не авторизован.')
            if(!UPDATED_ROLES.includes(role)) return res.status(403).json('Нет прав для совершения операции.')

            const {id} = fields
            if(!id) throw new Error('Не указан Id.')
    
            const data = await prisma.partner.delete({
                where: {
                    id: Number(id)
                }
            })
            return res.status(200).json(data);
        }
    }catch(e){
        return res.status(500).json(e.message);
    }
}