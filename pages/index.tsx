import React from "react"
import { GetServerSideProps } from "next"
import prisma from './../lib/prisma';
import Layout from "./../components/layout/Layout";
import { Button, Table} from "flowbite-react";
import useSWR from 'swr'
import Link from "next/link";
import { Partner } from "@prisma/client";

export const getServerSideProps: GetServerSideProps = async () => {
  const partners = await prisma.partner.findMany()
  return {
    props: {
      fallbackData: JSON.parse(JSON.stringify(partners))
    },
  }
}
export default function PartnerPage({fallbackData}:{fallbackData: Partner[]}){
  function ara(){
      fetch('https://script.google.com/macros/s/AKfycbyKzIQW9nWMi_oDCwUP5abKpuRNG1NzXHAaSzjai42nAXBkJmeJdrACE8HdNGspy0e4wA/exec', {
          method: 'POST',
          body: JSON.stringify({ara: 2})
      })
  } 
  const {data, error, isLoading} = useSWR<Partner[]>(`/api/partners/`, {fallbackData})
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
            Контакты <Button onClick={()=>ara()}>sds</Button>
          </Table.HeadCell>
          <Table.HeadCell>
            <Link href='/partners/create'><Button>+</Button></Link>
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
                  <Link href={`/partners/edit/${el.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-500">Edit</Link>
                </Table.Cell>
              </Table.Row>
            )
          })} 
        </Table.Body>

      </Table>
    </Layout>
  )
}

