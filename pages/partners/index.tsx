import React, { useEffect, useState } from "react"
import { GetServerSideProps } from "next"
import prisma from '../../lib/prisma';
import Layout from "../../components/layout/Layout";
import { Button, TextInput} from "flowbite-react";
import useSWR from 'swr'
import Link from "next/link";
import { Partner } from "@prisma/client";
import Image from "next/image";
import ErrorPlug from "../../components/layout/ErrorPlug";
import LoadingPlug from "../../components/layout/LoadingPlug";
import { useSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async () => {
  const partners = await prisma.partner.findMany()
  return {
    props: {
      fallbackData: JSON.parse(JSON.stringify(partners))
    },
  }
}
export default function PartnerPage({fallbackData}:{fallbackData: Partner[]}){
  const {data: session} = useSession()
  const [filterName, setFilterName] = useState('')
  const [filterInn, setFilterInn] = useState('')
  const [comparator, setComparator] = useState<{sortBy: 'id' | 'name' | 'inn', isOrderByAsc: boolean}>({sortBy: 'name', isOrderByAsc: true})
  const {data, error, isLoading} = useSWR<Partner[]>(`/api/partners/?name=${filterName}&inn=${filterInn}&sortBy=${comparator.sortBy}&orderBy=${comparator.isOrderByAsc ? 'asc' : 'desc'}`, {fallbackData})

  return (
      <Layout>
          <div className={`grid bg-gray-50 border-t border-gray-200 ${session?.user.accessLevel >= 2 ? 'pt-4 grid-cols-12' : 'py-4 grid-cols-11'}`}>
              <div className="col-span-1 text-center border-r border-gray-200">
                Форма
              </div>
              <div onClick={()=>setComparator({sortBy: 'name', isOrderByAsc: !comparator.isOrderByAsc})} className="col-span-4 text-center border-r border-gray-200 cursor-pointer underline">
                Название {comparator.sortBy === 'name' && <Image className="inline-block" src={`/images/${comparator.isOrderByAsc ? 'arrow-down' : 'arrow-up'}.svg`} alt='arrow' width={20} height={20}/>}
              </div>
              <div onClick={()=>setComparator({sortBy: 'inn', isOrderByAsc: !comparator.isOrderByAsc})} className="col-span-3 text-center border-r border-gray-200 cursor-pointer underline">
                ИНН {comparator.sortBy === 'inn' && <Image className="inline-block" src={`/images/${comparator.isOrderByAsc ? 'arrow-down' : 'arrow-up'}.svg`} alt='arrow' width={20} height={20}/>}
              </div>
              <div className="col-span-3 text-center border-r border-gray-200">Контакты</div>
              {session?.user.accessLevel >= 2 && 
              <div className="col-span-1 text-center flex justify-center">
                  <Link href='/partners/create'>
                      <Button>+</Button>
                  </Link>
              </div>
              }
          </div>
          <div className={`py-4 grid bg-gray-50 border-t border-gray-200 ${session?.user.accessLevel >= 2 ? 'grid-cols-12' : 'grid-cols-11'}`}>
              <div className="col-span-1 px-2 text-center border-r border-gray-200">
               
              </div>
              <div className="col-span-4 px-2 text-center border-r border-gray-200 cursor-pointer">
                <TextInput value={filterName} onChange={(e)=>setFilterName(e.target.value)} placeholder="Фильтр по названию договора"/>
              </div>
              <div className="col-span-3 px-2 text-center border-r border-gray-200 cursor-pointer">
                <TextInput value={filterInn} onChange={(e)=>setFilterInn(e.target.value)} placeholder="Фильтр по ИНН"/>
              </div>
              <div className="col-span-3 text-center border-r border-gray-200">
              </div>
              {session?.user.accessLevel >= 2 && 
              <div className="col-span-1 text-center flex justify-center">
                
              </div>}
              <div className="col-span-1 text-center flex justify-center"></div>
          </div>
          {error && 
            <ErrorPlug />
          }
          {isLoading &&
            <LoadingPlug />
          }
          {!error && !isLoading && data && data.map((el, i) => {
              return (
                <div className={`py-2 grid bg-gray-50 border-t border-gray-200 ${session?.user.accessLevel >= 2 ? 'grid-cols-12' : 'grid-cols-11'}`} key={i}>
                    <div className="p-2 col-span-1 border-r border-gray-200">{el.form}</div>
                    <div className="p-2 col-span-4 border-r border-gray-200">{el.name}</div>
                    <div className="p-2 col-span-3 border-r border-gray-200">{el.inn}</div>
                    <div className="p-2 col-span-3 border-r border-gray-200">{el.contacts}</div>
                    {session?.user.accessLevel >= 2 &&
                    <div className="p-2 col-span-1 text-center">
                      <Link href={`/partners/edit/${el.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                        Edit
                      </Link>
                    </div>
                    }
                </div>
              )
          })}
      </Layout>
  )
}

