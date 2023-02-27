import React from "react"
import { GetServerSideProps } from "next"
import prisma from '../../lib/prisma';
import Layout from "../../components/layout/Layout";
import { Button, Table } from "flowbite-react";
import useSWR from 'swr'
import Link from "next/link";
import { Contract, Prisma } from "@prisma/client";
import ContractRow from "../../components/ui/СontractRow";

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
                <ContractRow {...el} key={i}/>
            )
      })} 
    </Layout>
  )
}

