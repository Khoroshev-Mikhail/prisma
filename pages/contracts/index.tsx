import React, { useState } from "react"
import { GetServerSideProps } from "next"
import prisma from '../../lib/prisma';
import Layout from "../../components/layout/Layout";
import { Button, TextInput } from "flowbite-react";
import useSWR from 'swr'
import Link from "next/link";
import { Contract, Partner, Prisma } from "@prisma/client";
import ContractRow from "../../components/ui/–°ontractRow";
import Image from "next/image";
import ErrorPlug from "../../components/layout/ErrorPlug";
import LoadingPlug from "../../components/layout/LoadingPlug";
import { useSession } from "next-auth/react";

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
  const {data: session} = useSession()
  const [filterName, setFilterName] = useState('')
  const [filterParentId, setfilterParentId] = useState<string>(null)
  const [filterDate, setFilterDate] = useState<Date>(null)
  const [filterAccepted, setfilterAccepted] = useState<string>(null)
  const [comparator, setComparator] = useState<{sortBy: 'id' | 'name' | 'accepted', isOrderByAsc: boolean}>({sortBy: 'name', isOrderByAsc: true})
  const {data, error, isLoading, mutate} = useSWR<ContractExt[]>(`/api/contracts/?name=${filterName}&parentId=${filterParentId ?? ''}&accepted=${filterAccepted ?? ''}&date=${filterDate?.toJSON() ?? ''}&sortBy=${comparator.sortBy}&orderBy=${comparator.isOrderByAsc ? 'asc' : 'desc'}`, {fallbackData})
  const {data: parents} = useSWR<Partner[]>(`/api/partners/`)

  return (
    <Layout>
        <div className={`grid bg-gray-50 border-t border-gray-200 ${session?.user.accessLevel >= 2 ? 'pt-4 grid-cols-12' : 'py-4 grid-cols-11'}`}>
            <div 
              onClick={()=>setComparator({sortBy: 'name', isOrderByAsc: !comparator.isOrderByAsc})}
              className="underline cursor-pointer col-span-2 text-center border-r border-gray-200"
            >
              –Ě–ĺ–ľ–Ķ—Ä –ī–ĺ–≥–ĺ–≤–ĺ—Ä–į {comparator.sortBy === 'name' && <Image className="inline-block" src={`/images/${comparator.isOrderByAsc ? 'arrow-down' : 'arrow-up'}.svg`} alt='arrow' width={20} height={20}/>}
            </div>
            <div className="col-span-2 text-center border-r border-gray-200">
              –Ē–į—ā–į
            </div>
            <div className="col-span-2 text-center border-r border-gray-200">–ö–ĺ–Ĺ—ā—Ä–į–≥–Ķ–Ĺ—ā</div>
            <div className="col-span-2 text-center border-r border-gray-200">
              –°—ā–į—ā—É—Ā
            </div>
            <div className="col-span-2 text-center border-r border-gray-200">–ö–ĺ–ľ–ľ–Ķ–Ĺ—ā–į—Ä–ł–Ļ</div>
            <div className="col-span-1 text-center border-r border-gray-200">–°–ļ–į–Ĺ</div>
            {session?.user.accessLevel >= 2 &&
              <div className="col-span-1 text-center flex justify-center">
                  <Link href='/contracts/create'>
                      <Button>+</Button>
                  </Link>
              </div>
              }
        </div>
        <div className={`py-4 grid bg-gray-50 border-t border-gray-200 ${session?.user.accessLevel >= 2 ? 'grid-cols-12' : 'grid-cols-11'}`}>
            <div className="col-span-2 px-2 text-center border-r border-gray-200 ">
              <TextInput value={filterName} onChange={(e)=>setFilterName(e.target.value)} placeholder="–§–ł–Ľ—Ć—ā—Ä –Ņ–ĺ –Ĺ–į–∑–≤–į–Ĺ–ł—é"/>
            </div>
            <div className="col-span-2 text-center border-r border-gray-200">
            </div>
            <div className="px-2 col-span-2 text-center border-r border-gray-200">
                <select value={filterParentId ?? ''} onChange={(e)=>setfilterParentId(String(e.target.value))} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value=''>–í—Ā–Ķ</option>
                    {parents && parents.map((el, i) => {
                        return (
                            <option key={i} value={el.id}>
                                {el.name}
                            </option>
                        )
                    })}
                </select>
            </div>
            <div className="col-span-2 px-2 text-center border-r border-gray-200 ">
            <select value={filterAccepted ?? ''} onChange={(e)=>setfilterAccepted(String(e.target.value))} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option value=''>–í—Ā–Ķ</option>
                <option value="true">–ü—Ä–ł–Ĺ—Ź—ā</option>
                <option value="false">–ě—ā–ļ–Ľ–ĺ–Ĺ—Ď–Ĺ</option>
                <option value="null">–Ě–Ķ –ĺ–Ī—Ä–į–Ī–ĺ—ā–į–Ĺ</option>
              </select>
            </div>
            <div className="col-span-2 text-center border-r border-gray-200">

            </div>
            <div className="col-span-1 text-center border-r border-gray-200">

            </div>
            {session?.user.accessLevel >= 2 &&
            <div className="col-span-1 text-center flex justify-center">
            
            </div>
            }
        </div>
        {error && 
          <ErrorPlug />
        }
        {isLoading &&
          <LoadingPlug />
        }
        {!error && !isLoading && data && data.map((el, i) => {
            return (
                <ContractRow {...el} mutate={mutate} key={i}/>
            )
        })} 
    </Layout>
  )
}

