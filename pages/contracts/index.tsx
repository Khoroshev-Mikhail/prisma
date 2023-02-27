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
        <div className="py-4 grid grid-cols-12 bg-gray-50 border-t border-gray-200">
            <div className="col-span-2 text-center border-r border-gray-200">Номер договора</div>
            <div className="col-span-2 text-center border-r border-gray-200">Дата</div>
            <div className="col-span-2 text-center border-r border-gray-200">Контрагент</div>
            <div className="col-span-2 text-center border-r border-gray-200">Принять / Отклонить</div>
            <div className="col-span-1 text-center border-r border-gray-200">Скан</div>
            <div className="col-span-2 text-center border-r border-gray-200">Комментарий</div>
            <div className="col-span-1 text-center flex justify-center">
              <Link href='/contracts/create'>
                <Button>+</Button>
              </Link>
            </div>
        </div>
        {data && data.map((el, i) => {
            return (
              <div className="py-2 grid grid-cols-12 border-t border-gray-200" key={i}>
                <div className="p-2 col-span-2 border-r border-gray-200">{el.name}</div>
                <div className="p-2 col-span-2 border-r border-gray-200">{new Date(el.date).toLocaleDateString()}</div>
                <div className="p-2 col-span-2 border-r border-gray-200">{el.partner.form} {el.partner.name}</div>
                <div className="p-2 col-span-2 border-r border-gray-200 flex justify-center">
                  <Button.Group>
                      <Button color={el.accepted ? 'success' : 'gray'}>
                        Принять
                      </Button>
                      <Button  color={el.rejected ? 'failure' : 'gray'}>
                        Отклонить
                      </Button>
                  </Button.Group>
                </div>
                <div className="p-2 col-span-1 border-r border-gray-200 text-center">Скачать</div>
                <div className="p-2 col-span-2 border-r border-gray-200">{el.description}</div>
                <div className="p-2 col-span-1 text-center"><Link href={`/contracts/edit/${el.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-500">Edit</Link></div>
              </div>
            )
      })} 
    </Layout>
  )
}

