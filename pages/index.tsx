import React from "react"
import { GetServerSideProps } from "next"
import prisma from './../lib/prisma';
import Layout from "../components/layout/Layout";
import { Table, TextInput } from "flowbite-react";
import useSWR from 'swr'
export const getServerSideProps: GetServerSideProps = async () => {
  const partners = await prisma.partner.findMany()

  return {
    props: {
      fallbackData: JSON.parse(JSON.stringify(partners))
    },
  }
}
export default function Partner({fallbackData}){
  const {data, error, isLoading} = useSWR(`/api/partners/get`, {fallbackData})
  return (
    <Layout>
      <Table hoverable={true}>

        <Table.Head>
          <Table.HeadCell>
            ИНН
          </Table.HeadCell>
          <Table.HeadCell>
            Название
          </Table.HeadCell>
          <Table.HeadCell>
            Контакты
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
                  {el.inn}
                </Table.Cell>
                <Table.Cell>
                  {el.form} {el.name}
                </Table.Cell>
                <Table.Cell>
                  {el.contacts}
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

