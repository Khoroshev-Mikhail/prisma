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
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const [filterName, setFilterName] = useState('')
  const [filterParentId, setfilterParentId] = useState<string>(null)
  const [filterDate, setfilterDate] = useState<Date>(null)
  const {data, error, isLoading} = useSWR<Ks2Ext[]>(`/api/ks2/?name=${filterName}&parentId=${filterParentId ?? ''}&date=${filterDate?.toJSON() ?? ''}`, {fallbackData})
  const {data: parents} = useSWR<Ks2[]>(`/api/ks3/`)
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
      <div className="pt-4 grid grid-cols-12 bg-gray-50 border-t border-gray-200">
          <div 
            onClick={()=>toggleComparator(sortByName)} 
            className="col-span-2 text-center border-r border-gray-200 cursor-pointer underline"
          >
            Номер Кс-2 {comparator.fn === sortByName && <Image className="inline-block" src={`/images/${comparator.increase ? 'arrow-down' : 'arrow-up'}.svg`} alt='arrow' width={20} height={20}/>}
          </div>
          <div 
            onClick={()=>toggleComparator(sortByDate)} 
            className="col-span-2 text-center border-r border-gray-200 cursor-pointer underline "
          >
            Дата Кс-2 {comparator.fn === sortByDate && <Image className="inline-block" src={`/images/${comparator.increase ? 'arrow-down' : 'arrow-up'}.svg`} alt='arrow' width={20} height={20}/>}
          </div>
          <div className="col-span-2 text-center border-r border-gray-200">
            Вышестоящий документ
          </div>
          <div 
            onClick={()=>toggleComparator(sortByStatus)} 
            className="col-span-2 text-center border-r border-gray-200 cursor-pointer underline"
          >
            Статус {comparator.fn === sortByStatus && <Image className="inline-block" src={`/images/${comparator.increase ? 'arrow-down' : 'arrow-up'}.svg`} alt='arrow' width={20} height={20}/>}
          </div>
          <div className="col-span-1 text-center border-r border-gray-200">
            Скан
          </div>
          <div className="col-span-2 text-center border-r border-gray-200">
            Комментарий
          </div>
          <div className="col-span-1 text-center flex justify-center">
            <Link href='/ks2/create'>
              <Button>
                +
              </Button>
            </Link>
          </div>
      </div>
      <div className="py-4 grid grid-cols-12 bg-gray-50 border-t border-gray-200">
          <div className="col-span-2 px-2 text-center border-r border-gray-200">
            <TextInput value={filterName} onChange={(e)=>setFilterName(e.target.value)} placeholder="Фильтр по названию кс-2"/>
          </div>
          <div className="col-span-2 px-2 text-center border-r border-gray-200">
            <DatePicker selected={filterDate} onChange={(value: Date) => setfilterDate(value)} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg" />
          </div>
          <div className="col-span-2 px-2 text-center border-r border-gray-200">
          {parents &&
              <select id="countries" value={filterParentId ?? ''} onChange={(e)=>setfilterParentId(String(e.target.value))} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value={undefined}>

                  </option>
                  {parents && parents.map((el, i) => {
                      return (
                          <option key={i} value={el.id}>
                              {el.name}
                          </option>
                      )
                  })}
              </select>
          }
          </div>
          <div className="col-span-2 px-2 text-center border-r border-gray-200"></div>
          <div className="col-span-1 px-2 text-center border-r border-gray-200"></div>
          <div className="col-span-2 px-2 text-center border-r border-gray-200"></div>
          <div className="col-span-1 px-2 text-center border-r border-gray-200"></div>
      </div>
      {!isLoading && data && sorted.map((el, i) => {
        console.log(el)
            return (
              <Ks2Row {...el} key={i}/>
            )
      })} 
    </Layout>
  )
}
