import React from "react"
import { GetServerSideProps } from "next"
import prisma from '../../lib/prisma';
import Layout from "../../components/layout/Layout";
import { Table } from "flowbite-react";
import useSWR from 'swr'

export const getServerSideProps: GetServerSideProps = async () => {
  const contracts = await prisma.contract.findMany({
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
    props: {contracts: JSON.parse(JSON.stringify(contracts))},
  }
}

export default function Contracts({fallbackData}){
  const {data, error, isLoading} = useSWR(`/api/contracts/get`, {fallbackData})
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
                  {el.partner.form} {el.partner.name}
                </Table.Cell>
                <Table.Cell>
                  {el.desciption}
                </Table.Cell>
                <Table.Cell>
                  <a href="/tables" className="font-medium text-blue-600 hover:underline dark:text-blue-500">Edit</a>
                </Table.Cell>
              </Table.Row>
            )
          })} 
        </Table.Body>

      </Table>
    </Layout>
  )
}

