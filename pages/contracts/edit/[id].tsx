import { GetServerSideProps } from "next";
import { useRouter } from 'next/router';
import useSWR from 'swr'
import { Button, Dropdown, Label, Table, TextInput } from "flowbite-react";
import useSWRMutation from 'swr/mutation'
import { useEffect, useState } from "react";
import { deleteApi, updateApi } from "../../../lib/myFns";
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
    const {trigger: deleteData} = useSWRMutation(`/api/contracts/${id}`, deleteApi)

    //Локальный стейт
    const [name, setName] = useState<string>(data.name)
    const [description, setDescription] = useState<string | null>(data.description)
    const [date, setDate] = useState<Date>(new Date(data.date))
    const [expireDate, setExpireDate] = useState<Date | null>(new Date(data.expireDate))
    const [parentId, setParentId] = useState<number>(data.partner.id)

    //Рефакторинг???
    useEffect(()=>{
        setName(data.name)
        setDescription(data.description)
        setDate(new Date(data.date))
        setExpireDate(new Date(data.expireDate))
        setParentId(data.partner.id)
    }, [data])

    return (
        <Layout>
            <Table hoverable={true} className="overflow-visible">
                <Table.Head>
                    <Table.HeadCell>
                        Номер договора*
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Дата*
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Дата окончания
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Вышестоящий документ
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Скан*
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Описание
                    </Table.HeadCell>
                    <Table.HeadCell>
                        
                    </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>
                            <TextInput value={name} onChange={(e)=>{setName(e.target.value)}}/>
                        </Table.Cell>
                        <Table.Cell>
                            <DatePicker selected={date} onChange={(value: Date) => setDate(date)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg" />
                        </Table.Cell>
                        <Table.Cell>
                            <DatePicker selected={expireDate} onChange={(value: Date) => setExpireDate(date)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg" />
                        </Table.Cell>
                        <Table.Cell>
                        <select id="countries" value={parentId} onChange={(e)=>setParentId(Number(e.target.value))} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            {parents && parents.map((el, i) => {
                                return (
                                    <option key={i} value={el.id}>
                                        {el.name}
                                    </option>
                                )
                            })}
                        </select>
                        </Table.Cell>
                        <Table.Cell>
                            Скан
                        </Table.Cell>
                        <Table.Cell>
                            Скан
                        </Table.Cell>
                        <Table.Cell>
                            <Button onClick={()=>trigger({id: data.id, name, description, date, expireDate, parentId, email: session?.user?.email})}>Сохранить</Button>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            <Button color='failure' onClick={()=>deleteData({id: data.id})}>Удалить навсегда</Button>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>

            </Table>
        </Layout>
    )
}
Edit.auth = true