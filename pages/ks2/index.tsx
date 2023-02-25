import React from "react"
import { GetServerSideProps } from "next"
import prisma from '../../lib/prisma';
import Layout from "../../components/layout/Layout";
import { Button, Table, TextInput } from "flowbite-react";
import useSWR from 'swr'
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await prisma.ks2.findMany({
    include: {
      ks3: {
        select: {
          id: true,
          name: true,
          date: true,
          _count: true
        },
      }
    }
  })
  return {
    props: {
      fallbackData: JSON.parse(JSON.stringify(data))}
  }
}

export default function Ks2({fallbackData}){
  const {data, error, isLoading} = useSWR(`/api/ks2/get`, {fallbackData})
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
            Принять / Отклонить
          </Table.HeadCell>
          <Table.HeadCell>
            Комментарий
          </Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">
              Edit
            </span>
          </Table.HeadCell>
        </Table.Head>
      
        <Table.Body className="divide-y">
          {data && data.map((el, i) => {
            return (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={i}>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {el.name}
                </Table.Cell>
                <Table.Cell>
                  {new Date(el.date).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  КС-3 {el.ks3.name}
                </Table.Cell>
                <Table.Cell>
                  Ссылка на скачивание
                </Table.Cell>
                <Table.Cell>
                  <Button.Group>
                    <Button color={el.accepted ? 'success' : 'gray'}>
                      Принять
                    </Button>
                    <Button  color={el.rejected ? 'failure' : 'gray'}>
                      Отклонить
                    </Button>
                  </Button.Group>
                </Table.Cell>
                <Table.Cell>
                  {el.comment}
                </Table.Cell>
                <Table.Cell>
                  <Link href={`/ks2/edit/${el.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-500">Edit</Link>
                </Table.Cell>
              </Table.Row>
            )
          })} 
        </Table.Body>
      </Table>
    </Layout>
  )
}
