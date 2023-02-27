import { GetServerSideProps } from "next";
import { useRouter } from 'next/router';
import useSWR from 'swr'
import { Button, Table, TextInput } from "flowbite-react";
import useSWRMutation from 'swr/mutation'
import { useEffect, useState } from "react";
import { deleteApi, updateApi } from "../../../lib/APIFns";
import Layout from "../../../components/layout/Layout";
import prisma from "../../../lib/prisma";
import { useSession } from "next-auth/react";
import { Partner } from "@prisma/client";
import { forms } from "../create";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {id} = context.query
    const data = await prisma.partner.findUnique({
        where: {
            id: Number(id)
        }
    })
    return {
            props: {
                fallbackData: JSON.parse(JSON.stringify(data))
            },
        }
}
export default function Edit({fallbackData}:{fallbackData: Partner}){
    //Роутинги
    const router = useRouter()
    const {id} = router.query

    //UserData
    const {data: session} = useSession()

    //Асинхронная дата и мутации
    const {data, error, isLoading} = useSWR<Partner>(`/api/partners/${id}`, {fallbackData})
    const {trigger, error: updateError} = useSWRMutation(`/api/partners/${id}`, updateApi)
    const {trigger: deleteData, error: deleteError} = useSWRMutation(`/api/partners/${id}`, deleteApi)

    //Локальный стейт
    const [inn, setInn] = useState<string>(data?.inn)
    const [form, setForm] = useState<string>(data?.form)
    const [name, setName] = useState<string>(data?.name)
    const [contacts, setContacts] = useState<string>(data?.contacts || '')

    //Локальные функции
    function handler(id: number){
        const formData = new FormData()
        formData.append('id', String(id))
        formData.append('form', String(form))
        formData.append('name', String(name))
        formData.append('inn', String(inn))
        formData.append('contacts', String(contacts))
        formData.append('email', session.user.email)
        trigger(formData)
    }
    function deleteHandler(id: number){
        const formData = new FormData()
        formData.append('id', String(id))
        deleteData(formData)
    }

    //Эффекты
    useEffect(()=>{
        if(!error && data == null){
            router.push('/404')
        }
        if(data){
            setInn(data.inn)
            setForm(data.form)
            setName(data.name)
            setContacts(data.contacts || '')
        }
    }, [data])

    if(error || updateError || deleteError){
        //реализуй логику
    }    
    return (
        <Layout>
            <div className="py-4 grid grid-cols-12 bg-gray-50 border-t border-gray-200">
                <div className="col-span-1 text-center border-r border-gray-200">Форма</div>
                <div className="col-span-5 text-center border-r border-gray-200">Название</div>
                <div className="col-span-3 text-center border-r border-gray-200">ИНН</div>
                <div className="col-span-3 text-center border-r border-gray-200">Контакты</div>
            </div>
            {data &&
                <>
                    <div className="py-2 grid grid-cols-12 border-t border-gray-200">
                        <div className="p-2 col-span-1 border-r border-gray-200">
                            <select id="countries" value={form} onChange={(e)=>setForm(String(e.target.value))} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                {forms.map((el, i) => {
                                    return (
                                        <option key={i} value={el}>
                                            {el}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="p-2 col-span-5 border-r border-gray-200">
                            <TextInput value={name} onChange={(e)=>{setName(e.target.value)}}/>
                        </div>
                        <div className="p-2 col-span-3 border-r border-gray-200">
                            <TextInput value={inn} onChange={(e)=>{setInn(e.target.value)}}/>
                        </div>
                        <div className="p-2 col-span-3 border-r border-gray-200">
                            <TextInput value={contacts} onChange={(e)=>{setContacts(e.target.value)}}/>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 border-y border-gray-200">
                        <div className="p-2 col-span-12 flex justify-end">
                            <Button className="mr-10" color='failure' onClick={()=>deleteHandler(data.id)}>Удалить навсегда</Button>
                            <Button onClick={()=>handler(data.id)}>Изменить</Button>
                        </div>
                    </div>
                </>
            }
        </Layout>
    )
}
Edit.auth = true