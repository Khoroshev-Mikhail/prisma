import React, { useState } from "react"
import { GetServerSideProps } from "next"
import prisma from '../../lib/prisma';
import Layout from "../../components/layout/Layout";
import { Button, Table, TextInput } from "flowbite-react";
import useSWR from 'swr'
import Link from "next/link";
import { Ks2, Prisma } from "@prisma/client";
import Ks2Row from "../../components/ui/Ks2Row";
import { sortByDate, sortById, sortByINN, sortByName, sortByStatus } from "../../lib/comparators";

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
  const {data, mutate, error, isLoading} = useSWR<Ks2Ext[]>(`/api/ks2/`, {fallbackData})
  const [comparator, setComparator] = useState<{fn: any, increase: boolean}>({fn: sortById, increase: true})
  const sorted = data 
  ? comparator.increase
    ? [...data].sort(comparator.fn)
    : [...data].sort(comparator.fn).reverse()
  : undefined
  function toggleComparator(currentComparator: any){
    setComparator(({fn, increase}) => {
      return {
        fn: currentComparator,
        increase: fn === currentComparator ? !increase : true
      };
    })
  }
  return (
    <Layout>
      <div className="py-4 grid grid-cols-12 bg-gray-50 border-t border-gray-200">
          <div onClick={()=>toggleComparator(sortByName)} className="cursor-pointer col-span-2 text-center border-r border-gray-200">Номер Кс-2</div>
          <div onClick={()=>toggleComparator(sortByDate)} className="cursor-pointer col-span-2 text-center border-r border-gray-200">Дата Кс-2</div>
          <div className="col-span-2 text-center border-r border-gray-200">Вышестоящий документ</div>
          <div onClick={()=>toggleComparator(sortByStatus)} className="cursor-pointer col-span-2 text-center border-r border-gray-200">Статус</div>
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
              <Ks2Row {...el} mutate={mutate}/>
            )
      })} 
    </Layout>
  )
}
