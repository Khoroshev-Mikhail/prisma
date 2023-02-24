import { Button, Table, TextInput } from "flowbite-react";
import useSWRMutation from 'swr/mutation'
import { useState } from "react";
import { createApi } from "./../../lib/myFns";
import Layout from "./../../components/layout/Layout";
import { useSession } from "next-auth/react";

export default function PartnersCreate(){
    //UserData
    const {data: {user: {email} }} = useSession()

    //Асинхронная дата и мутации
    const { trigger } = useSWRMutation('/api/partners/set', createApi)

    //Локальный стейт
    const [inn, setInn] = useState<string>('')
    const [form, setForm] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [contacts, setContacts] = useState<string>('')

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
                            <TextInput value={contacts} onChange={(e)=>{setContacts(e.target.value)}}/>
                        </Table.Cell>
                        <Table.Cell>
                            <Button onClick={()=>trigger({inn, form, name, contacts, email})}>Создать</Button>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </Layout>
    )
}