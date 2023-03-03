import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try{
            //{"document":{
            //     "size":645379,
            //     "filepath":"/var/folders/8r/bhnfn59n7w57zp43ytnnlj5m0000gn/T/e3596d8a79dcd6c5928eb5703",
            //     "newFilename":"e3596d8a79dcd6c5928eb5703",
            //     "mimetype":"application/pdf",
            //     "mtime":"2023-02-26T16:22:20.808Z",
            //     "originalFilename":"05.10.2021.pdf"
            // }}
            //Иправить везде contractId и тп на parentId
        res.status(200).json('good');
    }catch(e){
        res.status(500).json(e.message);
    }
}