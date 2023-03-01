import { GetServerSideProps } from "next";
import { useRouter } from 'next/router';
import useSWR from 'swr'
import { Button, FileInput, TextInput } from "flowbite-react";
import useSWRMutation from 'swr/mutation'
import { useEffect, useState } from "react";
import { deleteApi, updateApi } from "../../../lib/APIFns";
import Layout from "../../../components/layout/Layout";
import prisma from "../../../lib/prisma";
import { useSession } from "next-auth/react";
import { Partner } from "@prisma/client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ContractExt } from "..";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {id} = context.query
    const data = await prisma.contract.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            partner: {
                select: {
                  id: true,
                  form: true,
                  name: true,
                  _count: true
                },
              }
        }
    })
    return {
            props: {
                fallbackData: JSON.parse(JSON.stringify(data))
            },
        }
}

export default function Edit({fallbackData}:{fallbackData: ContractExt}){
    //Роутинги
    const router = useRouter()
    const {id} = router.query

    //UserData
    const {data: session} = useSession()

    //Асинхронная дата и мутации
    const {data, error, isLoading} = useSWR<ContractExt>(`/api/contracts/${id}`, {fallbackData})
    const {data: parents} = useSWR<Partner[]>(`/api/partners/`)
    const {trigger} = useSWRMutation(`/api/contracts/${id}`, updateApi)
    const {trigger: deleteTrigger, data: deleteData, error: deleteError} = useSWRMutation(`/api/contracts/${id}`, deleteApi)

    //Локальный стейт
    const [name, setName] = useState<string>(data?.name)
    const [description, setDescription] = useState<string>(data?.description || '')
    const [date, setDate] = useState<Date>(new Date(data?.date))
    const [expireDate, setExpireDate] = useState<Date>(new Date(data?.expireDate))
    const [parentId, setParentId] = useState<number>(data?.partner.id)
    const [document, setDocument] = useState<File>(null)

    //Локальные функции
    function handler(id: number){
        const formData = new FormData()
        formData.append('id', String(id))
        formData.append('name', String(name))
        formData.append('description', String(description))
        formData.append('date', date.toJSON())
        formData.append('expireDate', expireDate.toJSON())
        formData.append('parentId', String(parentId))
        document && formData.append('document', document)
        formData.append('email', session.user.email)
        trigger(formData)
    }
    function deleteHandler(id: number){
        const formData = new FormData()
        formData.append('id', String(id))
        deleteTrigger(formData)
    }

    //Эффекты
    useEffect(()=>{
        if(!error && data == null){
            router.push('/404')
        }
        if(data){
            setName(data.name)
            setDescription(data.description || '')
            setDate(new Date(data.date))
            setExpireDate(new Date(data.expireDate))
            setParentId(data.partner.id)
        }
    }, [data])
    console.log(deleteData)
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
            {data &&
                <>
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