import React from "react"
import { GetServerSideProps } from "next"
import prisma from '../../lib/prisma';
import Layout from "../../components/Layout";

export const getServerSideProps: GetServerSideProps = async () => {
  const contracts = await prisma.contract.findMany({
    include: {
      partner: {
        select: {
          id: true,
          form: true,
          name: true
        }
      }
    }
  })
  return {
    props: {contracts: JSON.parse(JSON.stringify(contracts))},
  }
}

export default function Contracts({contracts}){
  return (
   <Layout>
    <div className="p-2 gap-2 grid grid-cols-10">
      <div className="p-2 col-span-2 cursor-pointer">Контрагент</div>
      <div className="p-2 col-span-2 cursor-pointer">Название договора</div>
      <div className="p-2 col-span-2 cursor-pointer">Дата</div>
      {/* <div className="p-2 col-span-2  ">Expire Date</div> */}
      <div className="p-2 col-span-2 cursor-pointer">Скачать</div>
      <div className="p-2 col-span-2 cursor-pointer">Ks3</div>
    </div>
    {contracts.map((el, i) => {
      return(
        <div className="p-2 gap-2 grid grid-cols-10" key={i}>
          <div className="p-2 col-span-2">{el.partner.form} {el.partner.name}</div>
          <div className="p-2 col-span-2">{el.name}</div>
          <div className="p-2 col-span-2">{el.date}</div>
          {/* <div className="p-2 col-span-2  ">{el.expire_date}</div> */}
          <div className="p-2 col-span-2">pdf</div>
          <div className="p-2 col-span-2">ks3</div>
        </div>
      )
    })}
    </Layout>
  )
}

