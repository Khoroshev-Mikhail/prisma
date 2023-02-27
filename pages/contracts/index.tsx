import React, { useState } from "react"
import { GetServerSideProps } from "next"
import prisma from '../../lib/prisma';
import Layout from "../../components/layout/Layout";
import { Button, Table } from "flowbite-react";
import useSWR from 'swr'
import Link from "next/link";
import { Contract, Prisma } from "@prisma/client";
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
  const {data, mutate, error, isLoading} = useSWR<ContractExt[]>(`/api/contracts/`, {fallbackData})
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
            <div onClick={()=>toggleComparator(sortByName)} className="cursor-pointer col-span-2 text-center border-r border-gray-200">
              Номер договора {comparator.fn === sortByName && <Image className="inline-block" src={`/images/${comparator.increase ? 'arrow-down' : 'arrow-up'}.svg`} alt='arrow' width={20} height={20}/>}
            </div>
            <div onClick={()=>toggleComparator(sortByDate)} className="cursor-pointer col-span-2 text-center border-r border-gray-200">
              Дата {comparator.fn === sortByDate && <Image className="inline-block" src={`/images/${comparator.increase ? 'arrow-down' : 'arrow-up'}.svg`} alt='arrow' width={20} height={20}/>}
            </div>
            <div className="col-span-2 text-center border-r border-gray-200">Контрагент</div>
            <div onClick={()=>toggleComparator(sortByStatus)} className="cursor-pointer col-span-2 text-center border-r border-gray-200">
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
        {data && sorted.map((el, i) => {
            return (
                <ContractRow {...el}  key={i}/>
            )
      })} 
    </Layout>
  )
}

