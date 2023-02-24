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
export default function PartnersEdit({fallbackData}){
    //Роутинги
    const router = useRouter()
    const {id} = router.query

    //UserData
    const {data: {user: {email} }} = useSession()

    //Асинхронная дата и мутации
    const {data, error, isLoading} = useSWR(`/api/partners/findUnique?id=${id}`, {fallbackData})
    const { trigger } = useSWRMutation('/api/partners/', updateApi)
    const { trigger: deleteParnter } = useSWRMutation('/api/partners/', deleteApi)

    //Локальный стейт
    const [inn, setInn] = useState<string>(data.inn)
    const [form, setForm] = useState<string>(data.form)
    const [name, setName] = useState<string>(data.name)
    const [contacts, setContacts] = useState<string>(data.contacts)

    //Рефакторинг???
    useEffect(()=>{
        setInn(data.inn)
        setForm(data.form)
        setName(data.name)
        setContacts(data.contacts)
    }, [data])

    return (
        <Layout>
            <Table hoverable={true}>

                <Table.Head>
                    <Table.HeadCell>
                        ИНН
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Форма соб-ти
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Название
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Контакты
                    </Table.HeadCell>
                    <Table.HeadCell>
                        
                    </Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            <TextInput value={inn} onChange={(e)=>{setInn(e.target.value)}}/>
                        </Table.Cell>
                        <Table.Cell>
                            <TextInput value={form} onChange={(e)=>{setForm(e.target.value)}}/>
                        </Table.Cell>
                        <Table.Cell>
                            <TextInput value={name} onChange={(e)=>{setName(e.target.value)}}/>
                        </Table.Cell>
                        <Table.Cell>
                            <TextInput value={contacts || undefined} onChange={(e)=>{setContacts(e.target.value)}}/>
                        </Table.Cell>
                        <Table.Cell>
                            <Button onClick={()=>trigger({id: data.id, inn, form, name, contacts, email})}>Сохранить</Button>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            <Button color='failure' onClick={()=>deleteParnter({id: data.id})}>Удалить навсегда</Button>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>

            </Table>
        </Layout>
    )
}