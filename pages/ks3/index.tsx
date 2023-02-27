import React, { useState } from "react"
import { GetServerSideProps } from "next"
import prisma from '../../lib/prisma';
import Layout from "../../components/layout/Layout";
import { Button } from "flowbite-react";
import useSWR from 'swr'
import Link from "next/link";
import { Ks3, Prisma } from "@prisma/client";
import Ks3Row from "../../components/ui/Ks3Row";
import { sortByDate, sortById, sortByName, sortByStatus } from "../../lib/comparators";

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
    const [comparator, setComparator] = useState<{fn: any, increase: boolean}>({fn: sortByStatus, increase: true})
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
                <div onClick={()=>toggleComparator(sortByName)} className="col-span-2 text-center border-r border-gray-200 cursor-pointer">Номер Кс-3</div>
                <div onClick={()=>toggleComparator(sortByDate)} className="col-span-2 text-center border-r border-gray-200">Дата Кс-3</div>
                <div className="col-span-2 text-center border-r border-gray-200">Вышестоящий документ</div>
                <div onClick={()=>toggleComparator(sortByStatus)} className="col-span-2 text-center border-r border-gray-200">Cтатус</div>
                <div className="col-span-1 text-center border-r border-gray-200">Скан</div>
                <div className="col-span-2 text-center border-r border-gray-200">Комментарий</div>
                <div className="col-span-1 text-center flex justify-center">
                    <Link href='/ks3/create'>
                        <Button>+</Button>
                    </Link>
                </div>
            </div>
            {data && sorted.map((el, i) => {
                return (
                  <Ks3Row {...el} key={i}/>
                )
            })} 
        </Layout>
    )
}

