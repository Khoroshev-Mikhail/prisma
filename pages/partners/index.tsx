import React, { useEffect } from "react"
import { GetServerSideProps } from "next"
import prisma from '../../lib/prisma';
import Layout from "../../components/Layout";
import { TextInput } from "flowbite-react";
import useSWR, { SWRConfig } from 'swr'

export const getServerSideProps: GetServerSideProps = async () => {
  const partners = await prisma.partner.findMany()
  return {
    props: {
      fallbackData: JSON.parse(JSON.stringify(partners))
    },
  }
}
export default function Partner({fallbackData}){
  const {data, error, isLoading} = useSWR(`/api/partners/get`, {fallbackData})
  return (
    <Layout>
    <div className="p-2 gap-2 grid grid-cols-6">
      <div className="p-2 col-span-2 cursor-pointer">ИНН</div>
      <div className="p-2 col-span-2 cursor-pointer">Наименование</div>
      <div className="p-2 col-span-2 cursor-pointer">Контакты</div>
    </div>   
    <div className="p-2 gap-2 grid grid-cols-6">
      <div className="p-2 col-span-2 cursor-pointer"><TextInput /></div>
      <div className="p-2 col-span-2 cursor-pointer">Наименование</div>
      <div className="p-2 col-span-2 cursor-pointer">Контакты</div>
    </div>    
    {data.map((el, i) => {
      return (
        <div className="p-2 gap-2 grid grid-cols-6" key={i}>
          <div className="p-2 col-span-2 cursor-pointer">{el.inn}</div>
          <div className="p-2 col-span-2 cursor-pointer">{el.form} {el.name}</div>
          <div className="p-2 col-span-2 cursor-pointer">{el.contacts}</div>
        </div>    
      )
    })}
    </Layout>
  )
}

