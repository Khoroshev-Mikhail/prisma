import { Button, FileInput, Table, TextInput } from "flowbite-react";
import useSWRMutation from 'swr/mutation'
import { useEffect, useState } from "react";
import useSWR from 'swr'
import { createApi } from "../../lib/myFns";
import Layout from "../../components/layout/Layout";
import { useSession } from "next-auth/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Partner } from "@prisma/client";

export default function Create(){
    //UserData
    const {data: session} = useSession()

    //Асинхронная дата и мутации
    const {trigger} = useSWRMutation('/api/contracts/', createApi)
    const {data: parents} = useSWR<Partner[]>(`/api/partners/`)

    //Локальный стейт
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [date, setDate] = useState<Date>(new Date())
    const [expireDate, setExpireDate] = useState<Date>(new Date())
    const [parentId, setParentId] = useState<number>()
    const [document, setDocument] = useState<File>(null)

    //Локальные функции
    function handler(){
        const formData = new FormData()
        formData.append('name', String(name))
        formData.append('description', String(description))
        formData.append('date', date.toJSON())
        formData.append('expireDate', expireDate.toJSON())
        formData.append('parentId', String(parentId))
        formData.append('document', document)
        formData.append('email', session.user.email)
        trigger(formData)
    }
    
    //Эффекты
    useEffect(()=>{
        parents && setParentId(parents[parents.length-1].id) //Либо достань из строки. когда сделаешь кнопку "добавить договор" со страницы контрагента
    }, [parents])

    return (
        <Layout>
            <div className="py-4 grid grid-cols-12 bg-gray-50 border-t border-gray-200">
                <div className="col-span-2 text-center border-r border-gray-200">Номер договора</div>
                <div className="col-span-2 text-center border-r border-gray-200">Дата</div>
                <div className="col-span-2 text-center border-r border-gray-200">Дата истечения</div>
                <div className="col-span-2 text-center border-r border-gray-200">Контрагент</div>
                <div className="col-span-2 text-center border-r border-gray-200">Скан</div>
                <div className="col-span-2 text-center">Комментарий</div>
            </div>
            <div className="py-2 grid grid-cols-12 border-t border-gray-200">
                <div className="p-2 col-span-2 border-r border-gray-200">
                    <TextInput value={name} onChange={(e)=>{setName(e.target.value)}}/>
                </div>
                <div className="p-2 col-span-2 border-r border-gray-200">
                    <DatePicker selected={date} onChange={(value: Date) => setDate(value)} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg" />
                </div>
                <div className="p-2 col-span-2 border-r border-gray-200">
                    <DatePicker selected={expireDate} onChange={(value: Date) => setExpireDate(value)} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg" />
                </div>
                <div className="p-2 col-span-2 border-r border-gray-200">
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
                <div className="p-2 col-span-2 border-r border-gray-200">    
                    <FileInput onChange={(e)=>setDocument(e.target.files && e.target.files[0])}/>
                </div>
                <div className="p-2 col-span-2">
                    <TextInput value={description} onChange={(e)=>{setDescription(e.target.value)}}/>
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