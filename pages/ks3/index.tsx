import React, { useState } from "react"
import { GetServerSideProps } from "next"
import prisma from '../../lib/prisma';
import Layout from "../../components/layout/Layout";
import { Button, TextInput } from "flowbite-react";
import useSWR from 'swr'
import Link from "next/link";
import { Contract, Ks3, Prisma } from "@prisma/client";
import Ks3Row from "../../components/ui/Ks3Row";
import { sortByDate, sortById, sortByName, sortByStatus } from "../../lib/comparators";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ContractExt } from "../contracts";

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
    const [filterName, setFilterName] = useState('')
    const [filterParentId, setfilterParentId] = useState<string>(null)
    const [filterDate, setFilterDate] = useState<Date>(null)
    const [filterAccepted, setfilterAccepted] = useState<string>(null)
    const [comparator, setComparator] = useState<{sortBy: 'id' | 'name' | 'accepted', isOrderByAsc: boolean}>({sortBy: 'name', isOrderByAsc: true})
    const {data, error, isLoading} = useSWR<ks3Ext[]>(`/api/ks3/?name=${filterName}&parentId=${filterParentId ?? ''}&accepted=${filterAccepted ?? ''}&date=${filterDate?.toJSON() ?? ''}&sortBy=${comparator.sortBy}&orderBy=${comparator.isOrderByAsc ? 'asc' : 'desc'}`, {fallbackData})
    const {data: parents} = useSWR<ContractExt[]>(`/api/contracts/`)
    
    return (
        <Layout>
            <div className="pt-4 grid grid-cols-12 bg-gray-50 border-t border-gray-200">
                <div 
                  onClick={()=>setComparator({sortBy: 'name', isOrderByAsc: !comparator.isOrderByAsc})}
                  className="underline cursor-pointer col-span-2 text-center border-r border-gray-200"
                >
                  Номер Кс-3 {comparator.sortBy === 'name' && <Image className="inline-block" src={`/images/${comparator.isOrderByAsc ? 'arrow-down' : 'arrow-up'}.svg`} alt='arrow' width={20} height={20}/>}
                </div>
                <div className="col-span-2 text-center border-r border-gray-200">Дата Кс-3</div>
                <div className="col-span-2 text-center border-r border-gray-200">Вышестоящий документ</div>
                <div className="col-span-2 text-center border-r border-gray-200">Статус</div>
                <div className="col-span-1 text-center border-r border-gray-200">Скан</div>
                <div className="col-span-2 text-center border-r border-gray-200">Комментарий</div>
                <div className="col-span-1 text-center flex justify-center">
                    <Link href='/ks3/create'>
                        <Button>+</Button>
                    </Link>
                </div>
            </div>
            <div className="py-4 grid grid-cols-12 bg-gray-50 border-t border-gray-200">
          <div className="col-span-2 px-2 text-center border-r border-gray-200">
            <TextInput value={filterName} onChange={(e)=>setFilterName(e.target.value)} placeholder="Фильтр по названию кс-2"/>
          </div>
          <div className="col-span-2 px-2 text-center border-r border-gray-200">
            {/* <DatePicker selected={filterDate} onChange={(value: Date) => setFilterDate(value)} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg" /> */}
          </div>
          <div className="col-span-2 px-2 text-center border-r border-gray-200">
            {parents &&
                <select value={filterParentId ?? ''} onChange={(e)=>setfilterParentId(String(e.target.value))} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value=''>Все</option>
                    {parents && parents.map((el, i) => {
                        return (
                            <option key={i} value={el.id}>
                                {el.name} с {el.partner.name} от {new Date(el.date).toLocaleDateString()}
                            </option>
                        )
                    })}
                </select>
            }
          </div>
          <div className="col-span-2 px-2 text-center border-r border-gray-200">
            <select value={filterAccepted ?? ''} onChange={(e)=>setfilterAccepted(String(e.target.value))} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value=''>Все</option>
              <option value="true">Принят</option>
              <option value="false">Отклонён</option>
              <option value="null">Не обработан</option>
            </select>
          </div>
          <div className="col-span-1 px-2 text-center border-r border-gray-200"></div>
          <div className="col-span-2 px-2 text-center border-r border-gray-200"></div>
          <div className="col-span-1 px-2 text-center border-r border-gray-200"></div>
        </div>
        {!isLoading && data && data.map((el, i) => {
            return (
              <Ks3Row {...el} key={i}/>
            )
        })} 
        </Layout>
    )
}

