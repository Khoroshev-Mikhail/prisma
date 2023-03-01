import React, { useState } from "react"
import { GetServerSideProps } from "next"
import prisma from '../../lib/prisma';
import Layout from "../../components/layout/Layout";
import { Button, Table, TextInput} from "flowbite-react";
import useSWR from 'swr'
import Link from "next/link";
import { Partner } from "@prisma/client";
import { sortById, sortByINN, sortByName } from "../../lib/comparators";
import Image from "next/image";

export const getServerSideProps: GetServerSideProps = async () => {
  const partners = await prisma.partner.findMany()
  return {
    props: {
      fallbackData: JSON.parse(JSON.stringify(partners))
    },
  }
}
export default function PartnerPage({fallbackData}:{fallbackData: Partner[]}){
  const [filterName, setFilterName] = useState('')
  const [filterInn, setFilterInn] = useState('')

  const {data, error, isLoading} = useSWR<Partner[]>(`/api/partners/?name=${filterName}&inn=${filterInn}`, {fallbackData})
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
              <div className="col-span-1 text-center border-r border-gray-200">
                Форма
              </div>
              <div onClick={()=>toggleComparator(sortByName)} className="col-span-4 text-center border-r border-gray-200 cursor-pointer underline">
                Название {comparator.fn === sortByName && <Image className="inline-block" src={`/images/${comparator.increase ? 'arrow-down' : 'arrow-up'}.svg`} alt='arrow' width={20} height={20}/>}
              </div>
              <div onClick={()=>toggleComparator(sortByINN)} className="col-span-3 text-center border-r border-gray-200 cursor-pointer underline">
                ИНН {comparator.fn === sortByINN && <Image className="inline-block" src={`/images/${comparator.increase ? 'arrow-down' : 'arrow-up'}.svg`} alt='arrow' width={20} height={20}/>}
              </div>
              <div className="col-span-3 text-center border-r border-gray-200">Контакты</div>
              <div className="col-span-1 text-center flex justify-center">
                <Link href='/partners/create'>
                    <Button>+</Button>
                </Link>
              </div>
          </div>
          <div className="py-4 grid grid-cols-12 bg-gray-50 border-t border-gray-200">
              <div className="col-span-1 px-2 text-center border-r border-gray-200">
               
              </div>
              <div className="col-span-4 px-2 text-center border-r border-gray-200 cursor-pointer">
                <TextInput value={filterName} onChange={(e)=>setFilterName(e.target.value)} placeholder="Фильтр по названию договора"/>
              </div>
              <div className="col-span-3 px-2 text-center border-r border-gray-200 cursor-pointer">
                <TextInput value={filterInn} onChange={(e)=>setFilterInn(e.target.value)} placeholder="Фильтр по ИНН"/>
              </div>
              <div className="col-span-3 text-center border-r border-gray-200"></div>
              <div className="col-span-1 text-center flex justify-center">
                
              </div>
          </div>
          {!isLoading && data && sorted.map((el, i) => {
              return (
                <div className="py-2 grid grid-cols-12 border-t border-gray-200" key={i}>
                    <div className="p-2 col-span-1 border-r border-gray-200">{el.form}</div>
                    <div className="p-2 col-span-4 border-r border-gray-200">{el.name}</div>
                    <div className="p-2 col-span-3 border-r border-gray-200">{el.inn}</div>
                    <div className="p-2 col-span-3 border-r border-gray-200">{el.contacts}</div>
                    <div className="p-2 col-span-1 text-center"><Link href={`/partners/edit/${el.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-500">Edit</Link></div>
                </div>
              )
          })}
      </Layout>
  )
}

