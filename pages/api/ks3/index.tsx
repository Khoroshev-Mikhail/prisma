import { getServerSession } from 'next-auth';
import prisma from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';
import formidable from "formidable";

export const config = {
    api: {
        bodyParser: false
    }
};

export default async function handler(req, res) {
    try{
        if(req.method === "GET"){
            const {name, parentId, accepted, comment, sortBy, orderBy} = req.query
            if(sortBy != undefined && !['id', 'name', 'accepted'].includes(String(sortBy))) throw new Error('Невозможная сортировка')
            const data = await prisma.ks3.findMany({
                where: {
                    name: {
                        contains: name ? String(name) : undefined,
                        mode: 'insensitive'
                    },
                    contractId: {
                        equals: parentId ? Number(parentId) : undefined
                    },
                    //Проблема фильтра по датам заключается в том, что: даты хранятся с часами, минутами и секундами и более. Дата 01.01.23-00-00-00 после метода toJSON вернет строку 31.12.2022-21-00-00 для московского времени! ПОТОМУ ЧТО МОСКВА ЮТС + 3
                    accepted: {
                        equals: (accepted === '' || !accepted || accepted === 'undefined') ? undefined : (accepted === 'true' ? true : accepted === 'false' ? false : null),
                    },
                    comment: comment ? String(comment) : undefined,
                },
                orderBy: {
                    id: sortBy === 'id' ? (orderBy === 'asc' ? 'asc' : 'desc') : undefined, 
                    name: sortBy === 'name' ? (orderBy === 'asc' ? 'asc' : 'desc') : undefined, 
                },
                include: {
                  contract: {
                    select: {
                      id: true,
                      name: true,
                      date: true,
                      _count: true
                    },
                  }
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

            const form = await formidable({ multiples: true });
            const formData: Promise<{fields: any, files?: File}> = new Promise((resolve, reject) => {
              form.parse(req, async (err, fields, files) => {
                if (err) {
                  reject("error");
                }
                resolve({ fields, files });
              });
            });
            const { fields, files } = await formData;

            //{"document":{
            //     "size":645379,
            //     "filepath":"/var/folders/8r/bhnfn59n7w57zp43ytnnlj5m0000gn/T/e3596d8a79dcd6c5928eb5703",
            //     "newFilename":"e3596d8a79dcd6c5928eb5703",
            //     "mimetype":"application/pdf",
            //     "mtime":"2023-02-26T16:22:20.808Z",
            //     "originalFilename":"05.10.2021.pdf"
            // }}
            //Иправить везде contractId и тп на parentId
            
            const {name, date, parentId, email, accepted, comment} = fields
            if(!name || !date || !parentId || !email) throw new Error('Указаны не все данные.')

            const {id: authorId} = await prisma.user.findUnique({
                where: {
                    email: String(email)
                }
            })        
            if(!authorId) throw new Error('Не указан автор.')

            const data = await prisma.ks3.create({
                data: {
                    name: String(name),
                    date: String(date),
                    contractId: Number(parentId),
                    authorId: Number(authorId),
                    accepted: accepted ? !!accepted : undefined,
                    comment: comment ? String(comment) : undefined,
                }
            })
            res.status(200).json(data);
            return
        }
    }catch(e){
        res.status(500).json(e.message);
    }
}