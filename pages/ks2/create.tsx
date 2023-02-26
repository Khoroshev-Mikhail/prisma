import { Button, Table, TextInput } from "flowbite-react";
import useSWRMutation from 'swr/mutation'
import { useEffect, useState } from "react";
import useSWR from 'swr'
import { createApi } from "../../lib/myFns";
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

    //Эффекты
    useEffect(()=>{
        parents && setParentId(parents[parents.length-1].id) //Либо достань из строки. когда сделаешь кнопку "добавить договор" со страницы контрагента
    }, [parents])

    return (
        <Layout>
            <Table hoverable={true}>
                <Table.Head>
                    <Table.HeadCell>
                        Номер КС-2*
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Дата*
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Вышестоящий документ
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Скан*
                    </Table.HeadCell>
                    <Table.HeadCell>
                        
                    </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            <TextInput value={name} onChange={(e)=>{setName(e.target.value)}}/>
                        </Table.Cell>
                        <Table.Cell>
                            <DatePicker selected={date} onChange={(value: Date) => setDate(value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg" />
                        </Table.Cell>
                        <Table.Cell>
                            { parents &&
                                <select id="countries" value={parentId} onChange={(e)=>setParentId(Number(e.target.value))} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    {parents && parents.map((el, i) => {
                                        return (
                                            <option key={i} value={el.id}>
                                                {el.name}
                                            </option>
                                        )
                                    })}
                                </select>
                            }
                        </Table.Cell>
                        <Table.Cell>
                            Скан
                        </Table.Cell>
                        <Table.Cell>
                            <Button onClick={()=>trigger({name, date, parentId, email: session?.user?.email})}>Создать</Button>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </Layout>
    )
}
Create.auth = true