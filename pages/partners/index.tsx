import React, { useState } from "react"
import { GetServerSideProps } from "next"
import prisma from '../../lib/prisma';
import Layout from "../../components/layout/Layout";
import { Button, Table} from "flowbite-react";
import useSWR from 'swr'
import Link from "next/link";
import { Partner } from "@prisma/client";
import { sortById, sortByINN, sortByName } from "../../lib/comparators";

export const getServerSideProps: GetServerSideProps = async () => {
  const partners = await prisma.partner.findMany()
  return {
    props: {
      fallbackData: JSON.parse(JSON.stringify(partners))
    },
  }
}
export default function PartnerPage({fallbackData}:{fallbackData: Partner[]}){
  const {data, error, isLoading} = useSWR<Partner[]>(`/api/partners/`, {fallbackData})
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
              <div className="col-span-5 text-center border-r border-gray-200 cursor-pointer" onClick={()=>toggleComparator(sortByName)}>Название</div>
              <div className="col-span-3 text-center border-r border-gray-200 cursor-pointer" onClick={()=>toggleComparator(sortByINN)}>ИНН</div>
              <div className="col-span-3 text-center border-r border-gray-200">Контакты</div>
              <div className="col-span-1 text-center flex justify-center">
                <Link href='/partners/create'>
                    <Button>+</Button>
                </Link>
              </div>
          </div>
          {data && sorted.map((el, i) => {
              return (
                <div className="py-2 grid grid-cols-12 border-t border-gray-200" key={i}>
                    <div className="p-2 col-span-5 border-r border-gray-200">{el.form} {el.name}</div>
                    <div className="p-2 col-span-3 border-r border-gray-200">{el.inn}</div>
                    <div className="p-2 col-span-3 border-r border-gray-200">{el.contacts}</div>
                    <div className="p-2 col-span-1 text-center"><Link href={`/partners/edit/${el.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-500">Edit</Link></div>
                </div>
              )
          })}
      </Layout>
  )
}

