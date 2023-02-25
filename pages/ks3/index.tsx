import React from "react"
import { GetServerSideProps } from "next"
import prisma from '../../lib/prisma';
import Layout from "../../components/layout/Layout";
import { Button, Table } from "flowbite-react";
import useSWR from 'swr'
import Link from "next/link";
import { Ks3, Prisma } from "@prisma/client";


export type ks3Ext = Ks3 & {
  contract: {
    name: string;
    id: number;
    date: Date;
    _count: Prisma.ContractCountOutputType;
};
}
export const getServerSideProps: GetServerSideProps = async () => {
  const data = await prisma.ks3.findMany({
    include: {
      contract: {
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
      fallbackData: JSON.parse(JSON.stringify(data))
    },
  }
}

export default function Ks3Page({fallbackData}:{fallbackData: ks3Ext[]}){
  const {data, error, isLoading} = useSWR<ks3Ext[]>(`/api/ks3/`, {fallbackData})
  return (
    <Layout>
      <Table hoverable={true}>

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
                  Договор {el.contract.name}
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
                  <Link href={`/ks3/edit/${el.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-500">Edit</Link>
                </Table.Cell>
              </Table.Row>
            )
          })} 
        </Table.Body>
      </Table>
    </Layout>
  )
}

