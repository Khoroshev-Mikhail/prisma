import { GetServerSideProps } from "next";
import { useRouter } from 'next/router';
import useSWR from 'swr'
import { Button, Table, TextInput } from "flowbite-react";
import useSWRMutation from 'swr/mutation'
import { useEffect, useState } from "react";
import { deleteApi, updateApi } from "../../../lib/myFns";
import Layout from "../../../components/layout/Layout";
import prisma from "../../../lib/prisma";
import { useSession } from "next-auth/react";
import { Ks2 } from "@prisma/client";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {id} = context.query
    const data = await prisma.ks2.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            ks3: {
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
export default function PartnersEdit({fallbackData}:{fallbackData: Ks2}){
    //Роутинги
    const router = useRouter()
    const {id} = router.query

    //UserData
    const {data: session} = useSession()

    //Асинхронная дата и мутации
    const {data, error, isLoading} = useSWR<Ks2>(`/api/ks2/findUnique?id=${id}`, {fallbackData})
    const { trigger } = useSWRMutation('/api/ks2/', updateApi)
    const { trigger: deleteData } = useSWRMutation('/api/ks2/', deleteApi)

    //Локальный стейт
    const [name, setName] = useState<string>(data.name)
    const [date, setDate] = useState<Date>(data.date)
    const [ks3Id, setContractId] = useState<number>(data.ks3Id)

    //Рефакторинг???
    useEffect(()=>{
        setName(data.name)
        setDate(data.date)
        setContractId(data.ks3Id)
    }, [data])

    return (
        <Layout>
            <Table hoverable={true}>
                <Table.Head>
                    <Table.HeadCell>
                        Номер КС-2
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

                        </Table.Cell>
                        <Table.Cell>
                           Select
                        </Table.Cell>
                        <Table.Cell>
                            Скан
                        </Table.Cell>
                        <Table.Cell>
                            <Button onClick={()=>trigger({id: data.id, name, date, email: session?.user?.email, ks3Id})}>Сохранить</Button>
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