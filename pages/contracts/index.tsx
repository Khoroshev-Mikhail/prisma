import React from "react"
import { GetServerSideProps } from "next"
import prisma from '../../lib/prisma';
import Layout from "../../components/layout/Layout";
import { Button, Table } from "flowbite-react";
import useSWR from 'swr'
import Link from "next/link";
import { Contract, Prisma } from "@prisma/client";

export type ContractExt = Contract & {
  partner: {
      id: number;
      name: string;
      form: string;
      _count: Prisma.PartnerCountOutputType;
  };
}
export const getServerSideProps: GetServerSideProps = async () => {
  const data = await prisma.contract.findMany({
    include: {
      partner: {
        select: {
          id: true,
          form: true,
          name: true,
          _count: true,
        }
      }
    }
  })
  return {
    props: {
      fallbackData: JSON.parse(JSON.stringify(data))
    },
  }
}

export default function Contracts({fallbackData}:{fallbackData: ContractExt[]}){
  const {data, error, isLoading} = useSWR<ContractExt[]>(`/api/contracts/`, {fallbackData})
  return (
    <Layout>
      <Table hoverable={true}>

        <Table.Head>
          <Table.HeadCell>
            № Договора
          </Table.HeadCell>
          <Table.HeadCell>
            Дата
          </Table.HeadCell>
          <Table.HeadCell>
            Контрагент
          </Table.HeadCell>
          <Table.HeadCell>
            Доп.инфо
          </Table.HeadCell>
          <Table.HeadCell>
              <Link href='/contracts/create'><Button>+</Button></Link>
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
                  {el.partner.form} {el.partner.name}
                </Table.Cell>
                <Table.Cell>
                  {el.description}
                </Table.Cell>
                <Table.Cell>
                  <Link href={`/contracts/edit/${el.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-500">Edit</Link>
                </Table.Cell>
              </Table.Row>
            )
          })} 
        </Table.Body>

      </Table>
    </Layout>
  )
}

