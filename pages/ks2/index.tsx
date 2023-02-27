import React from "react"
import { GetServerSideProps } from "next"
import prisma from '../../lib/prisma';
import Layout from "../../components/layout/Layout";
import { Button, Table, TextInput } from "flowbite-react";
import useSWR from 'swr'
import Link from "next/link";
import { Ks2, Prisma } from "@prisma/client";

export type Ks2Ext = Ks2 & {
  ks3: {
    name: string;
    id: number;
    date: Date;
    _count: Prisma.Ks3CountOutputType;
};
}

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

export default function Ks2Page({fallbackData}:{fallbackData: Ks2Ext[]}){
  const {data, error, isLoading} = useSWR<Ks2Ext[]>(`/api/ks2/`, {fallbackData})
  return (
    <Layout>
      <div className="py-4 grid grid-cols-12 bg-gray-50 border-t border-gray-200">
          <div className="col-span-2 text-center border-r border-gray-200">Номер Кс-2</div>
          <div className="col-span-2 text-center border-r border-gray-200">Дата Кс-2</div>
          <div className="col-span-2 text-center border-r border-gray-200">Вышестоящий документ</div>
          <div className="col-span-2 text-center border-r border-gray-200">Принять / Отклонить</div>
          <div className="col-span-1 text-center border-r border-gray-200">Скан</div>
          <div className="col-span-2 text-center border-r border-gray-200">Комментарий</div>
          <div className="col-span-1 text-center flex justify-center">
            <Link href='/ks2/create'>
              <Button>+</Button>
            </Link>
          </div>
      </div>
      {data && data.map((el, i) => {
            return (
              <div className="py-2 grid grid-cols-12 border-t border-gray-200" key={i}>
                <div className="p-2 col-span-2 border-r border-gray-200">{el.name}</div>
                <div className="p-2 col-span-2 border-r border-gray-200">{new Date(el.date).toLocaleDateString()}</div>
                <div className="p-2 col-span-2 border-r border-gray-200">{el.ks3.name}</div>
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
                <div className="p-2 col-span-2 border-r border-gray-200">{el.comment}</div>
                <div className="p-2 col-span-1 text-center"><Link href={`/ks2/edit/${el.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-500">Edit</Link></div>
              </div>
            )
      })} 
    </Layout>
  )
}
