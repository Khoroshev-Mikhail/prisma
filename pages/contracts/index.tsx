import React, { useState } from "react"
import { GetServerSideProps } from "next"
import prisma from '../../lib/prisma';
import Layout from "../../components/layout/Layout";
import { Button, Table, TextInput } from "flowbite-react";
import useSWR from 'swr'
import Link from "next/link";
import { Contract, Partner, Prisma } from "@prisma/client";
import ContractRow from "../../components/ui/СontractRow";
import { sortByDate, sortById, sortByName, sortByStatus } from "../../lib/comparators";
import Image from "next/image";

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
  const [filterName, setFilterName] = useState('')
  const [filterParentId, setfilterParentId] = useState<string>(null)
  const [filterDate, setFilterDate] = useState<Date>(null)
  const [filterAccepted, setfilterAccepted] = useState<string>(null)
  const {data, error, isLoading} = useSWR<ContractExt[]>(`/api/contracts/?name=${filterName}&parentId=${filterParentId ?? ''}&accepted=${filterAccepted ?? ''}&date=${filterDate?.toJSON() ?? ''}`, {fallbackData})
  const {data: parents} = useSWR<Partner[]>(`/api/partners/`)
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
            <div onClick={()=>toggleComparator(sortByName)} className="cursor-pointer underline col-span-2 text-center border-r border-gray-200">
              Номер договора {comparator.fn === sortByName && <Image className="inline-block" src={`/images/${comparator.increase ? 'arrow-down' : 'arrow-up'}.svg`} alt='arrow' width={20} height={20}/>}
            </div>
            <div onClick={()=>toggleComparator(sortByDate)} className="cursor-pointer underline col-span-2 text-center border-r border-gray-200">
              Дата {comparator.fn === sortByDate && <Image className="inline-block" src={`/images/${comparator.increase ? 'arrow-down' : 'arrow-up'}.svg`} alt='arrow' width={20} height={20}/>}
            </div>
            <div className="col-span-2 text-center border-r border-gray-200">Контрагент</div>
            <div onClick={()=>toggleComparator(sortByStatus)} className="cursor-pointer underline col-span-2 text-center border-r border-gray-200">
              Статус {comparator.fn === sortByStatus && <Image className="inline-block" src={`/images/${comparator.increase ? 'arrow-down' : 'arrow-up'}.svg`} alt='arrow' width={20} height={20}/>}
            </div>
            <div className="col-span-1 text-center border-r border-gray-200">Скан</div>
            <div className="col-span-2 text-center border-r border-gray-200">Комментарий</div>
            <div className="col-span-1 text-center flex justify-center">
              <Link href='/contracts/create'>
                <Button>+</Button>
              </Link>
            </div>
        </div>
        <div className="py-4 grid grid-cols-12 bg-gray-50 border-t border-gray-200">
            <div className="col-span-2 px-2 text-center border-r border-gray-200 ">
              <TextInput value={filterName} onChange={(e)=>setFilterName(e.target.value)} placeholder="Фильтр по названию"/>
            </div>
            <div className="col-span-2 text-center border-r border-gray-200">
            </div>
            <div className="px-2 col-span-2 text-center border-r border-gray-200">
            {parents &&
                  <select value={filterParentId ?? ''} onChange={(e)=>setfilterParentId(String(e.target.value))} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                      <option value=''>Все</option>
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
            <div className="col-span-2 px-2 text-center border-r border-gray-200 ">
            <select value={filterAccepted ?? ''} onChange={(e)=>setfilterAccepted(String(e.target.value))} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option value=''>Все</option>
                <option value="true">Принят</option>
                <option value="false">Отклонён</option>
                <option value="null">Не обработан</option>
              </select>
            </div>
            <div className="col-span-1 text-center border-r border-gray-200">

            </div>
            <div className="col-span-2 text-center border-r border-gray-200">

            </div>
            <div className="col-span-1 text-center flex justify-center">
            </div>
        </div>
        {!isLoading && data && sorted.map((el, i) => {
            return (
                <ContractRow {...el} key={i}/>
            )
        })} 
    </Layout>
  )
}

