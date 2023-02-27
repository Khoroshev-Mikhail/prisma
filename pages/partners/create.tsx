import { Button, Table, TextInput } from "flowbite-react";
import useSWRMutation from 'swr/mutation'
import { useState } from "react";
import { createApi } from "../../lib/fnsAPI";
import Layout from "./../../components/layout/Layout";
import { useSession } from "next-auth/react";

export const forms = ['ООО', 'ИП', 'ЗАО', 'ОАО']

export default function Create(){
    //UserData
    const {data: session} = useSession()

    //Асинхронная дата и мутации
    const {trigger} = useSWRMutation('/api/partners/', createApi)

    //Локальный стейт
    const [inn, setInn] = useState<string>('')
    const [form, setForm] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [contacts, setContacts] = useState<string>('')

    //Локальные функции
    function handler(){
        const formData = new FormData()
        formData.append('form', String(form))
        formData.append('name', String(name))
        formData.append('inn', String(inn))
        formData.append('contacts', String(contacts))
        formData.append('email', session.user.email)
        trigger(formData)
    }

    return (
        <Layout>
            <div className="py-4 grid grid-cols-12 bg-gray-50 border-t border-gray-200">
                <div className="col-span-1 text-center border-r border-gray-200">Форма</div>
                <div className="col-span-5 text-center border-r border-gray-200">Название</div>
                <div className="col-span-3 text-center border-r border-gray-200">ИНН</div>
                <div className="col-span-3 text-center border-r border-gray-200">Контакты</div>
            </div>
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
                <div className="p-2 col-span-3">
                    <TextInput value={contacts} onChange={(e)=>{setContacts(e.target.value)}}/>
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