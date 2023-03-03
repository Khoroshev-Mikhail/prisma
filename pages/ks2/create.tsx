import { Button, FileInput, Table, TextInput } from "flowbite-react";
import useSWRMutation from 'swr/mutation'
import { useEffect, useState } from "react";
import useSWR from 'swr'
import { createApi } from "../../lib/APIFns";
import Layout from "../../components/layout/Layout";
import { useSession } from "next-auth/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Ks2 } from "@prisma/client";

export default function Create(){
    //UserData
    const {data: session} = useSession()

    //Асинхронная дата и мутации
    const {trigger} = useSWRMutation('/api/ks2/', createApi)
    const {data: parents} = useSWR<Ks2[]>(`/api/ks3/`)

    //Локальный стейт
    const [name, setName] = useState<string>('')
    const [date, setDate] = useState<Date>(new Date())
    const [parentId, setParentId] = useState<number>()
    const [document, setDocument] = useState<File>(null)

    //Локальные функции
    function handler(){
        const formData = new FormData()
        formData.append('name', String(name))
        formData.append('date', date.toJSON())
        formData.append('parentId', String(parentId))
        formData.append('document', document)
        trigger(formData)
    }

    //Эффекты
    useEffect(()=>{
        parents && setParentId(parents[parents.length-1].id) //Либо достань из строки. когда сделаешь кнопку "добавить договор" со страницы контрагента
    }, [parents])

    return (
        <Layout>
                <div className="py-4 grid grid-cols-12 bg-gray-50 border-t border-gray-200">
                    <div className="col-span-3 text-center border-r border-gray-200">Номер Кс-2</div>
                    <div className="col-span-2 text-center border-r border-gray-200">Дата Кс-2</div>
                    <div className="col-span-3 text-center border-r border-gray-200">Вышестоящий документ</div>
                    <div className="col-span-4 text-center">Скан</div>
                </div>
                <div className="py-2 grid grid-cols-12 border-t border-gray-200">
                    <div className="p-2 col-span-3 border-r border-gray-200">
                        <TextInput value={name} onChange={(e)=>{setName(e.target.value)}}/>
                    </div>
                    <div className="p-2 col-span-2 border-r border-gray-200">
                        <DatePicker selected={date} onChange={(value: Date) => setDate(value)} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg" />
                    </div>
                    <div className="p-2 col-span-3 border-r border-gray-200">
                        {parents &&
                            <select id="countries" value={parentId} onChange={(e)=>setParentId(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                {parents && parents.map((el, i) => {
                                    return (
                                        <option key={i} value={el.id}>
                                            {el.name}
                                        </option>
                                    )
                                })}
                            </select>
                        }
                    </div>
                    <div className="p-2 col-span-4 text-center">
                        <FileInput onChange={(e)=>setDocument(e.target.files && e.target.files[0])}/>
                    </div>
                </div>
                <div className="grid grid-cols-12 border-y border-gray-200">
                    <div className="p-2 col-span-12 flex justify-end">
                        <Button onClick={()=>handler()}>Создать</Button>
                    </div>
                </div>
        </Layout>
    )
}
Create.auth = true