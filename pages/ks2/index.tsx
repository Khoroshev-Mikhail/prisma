import React from "react"
import { GetServerSideProps } from "next"
import prisma from '../../lib/prisma';
import Layout from "../../components/Layout";
import { TextInput } from "flowbite-react";
import Ks2line from "../../components/Ks2-line";

export const getServerSideProps: GetServerSideProps = async () => {
  const ks2 = await prisma.ks2.findMany({
    include: {
      ks3: {
        select: {
          id: true,
          name: true,
          date: true
        },
      }
    }
  })
  return {
    props: {
      ks2: JSON.parse(JSON.stringify(ks2))}
  }
}

export default function Ks2({ks2}){
  return (
    <Layout>
      <div className="px-4 gap-2 grid grid-cols-10">
        {/* <div className="p-2 col-span-2 cursor-pointer">Partner</div> */}
        <div className="col-span-2 cursor-pointer">Вышестоящий акт</div>
        <div className="col-span-2 cursor-pointer">Номер кс-2</div>
        <div className="col-span-2 cursor-pointer">Дата кс-2</div>
        <div className="col-span-2 cursor-pointer">Отклонить / Принять</div>
        <div className="col-span-2 cursor-pointer">Комментарий</div>
      </div>
      <div className="px-4 gap-2 grid grid-cols-10">
        {/* <div className="p-2 col-span-2 cursor-pointer">Partner</div> */}
        <div className="col-span-2 cursor-pointer"><TextInput sizing="sm" /></div>
        <div className="col-span-2 cursor-pointer"><TextInput sizing="sm"/></div>
        <div className="col-span-2 cursor-pointer"></div>
        <div className="col-span-2 cursor-pointer"></div>
        <div className="col-span-2 cursor-pointer"><TextInput sizing="sm"/></div>
      </div>
      {ks2.map((el, i) => {
        return(
          <Ks2line {...el}/>
        )
      })}
    </Layout>
  )
}
