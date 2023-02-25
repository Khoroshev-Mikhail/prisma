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
import { Contract, Ks3 } from "@prisma/client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {id} = context.query
    //вынеси в сервисы
    const data = await prisma.ks3.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            contract: {
                select: {
                  id: true,
                  date: true,
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
export default function PartnersEdit({fallbackData}:{fallbackData: Ks3}){
    //Роутинги
    const router = useRouter()
    const {id} = router.query

    //UserData
    const {data: session} = useSession()

    //Асинхронная дата и мутации
    const {data, error, isLoading} = useSWR<Ks3>(`/api/ks3/findUnique?id=${id}`, {fallbackData})
    const {data: parents} = useSWR<Contract[]>(`/api/contracts/`)
    const {trigger} = useSWRMutation('/api/ks3/', updateApi)
    const {trigger: deleteData} = useSWRMutation('/api/ks3/', deleteApi)

    //Локальный стейт
    const [name, setName] = useState<string>(data.name)
    const [date, setDate] = useState<Date>(new Date(data.date))
    const [contractId, setContractId] = useState<number>(data.contractId)

    //Рефакторинг???
    useEffect(()=>{
        setName(data.name)
        setDate(new Date(data.date))
        setContractId(data.contractId)

    }, [data])

    return (
        <Layout>
            <Table hoverable={true} className="overflow-visible">
                <Table.Head>
                    <Table.HeadCell>
                        Номер КС-3
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Дата
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Вышестоящий док-т
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Скан
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
                            <DatePicker className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg" selected={date} onChange={(date: Date) => setDate(date)} />
                        </Table.Cell>
                        <Table.Cell>
                        <select id="countries" value={data.contractId} onChange={(e)=>setContractId(Number(e.target.value))} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
                            <Button onClick={()=>trigger({id: data.id, name, date, email: session?.user?.email, contractId})}>Сохранить</Button>
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