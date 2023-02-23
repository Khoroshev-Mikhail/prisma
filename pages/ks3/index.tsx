import React from "react"
import { GetServerSideProps } from "next"
import prisma from '../../lib/prisma';
import Layout from "../../components/Layout";

export const getServerSideProps: GetServerSideProps = async () => {
  const ks3 = await prisma.ks3.findMany({
    include: {
      contract: {
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
    props: {ks3: JSON.parse(JSON.stringify(ks3))},
  }
}

export default function Ks3({ks3}){
  return (
    <Layout>
      <div className="p-2 gap-2 grid grid-cols-10">
        {/* <div className="p-2 col-span-2 cursor-pointer">Partner</div> */}
        <div className="p-2 col-span-2 cursor-pointer">Договор</div>
        <div className="p-2 col-span-2 cursor-pointer">Номер кс-3</div>
        <div className="p-2 col-span-2 cursor-pointer">Дата кс-2</div>
        <div className="p-2 col-span-2 cursor-pointer">Отклонить / Принять</div>
        <div className="p-2 col-span-2 cursor-pointer">Комментарий</div>
      </div>
      {ks3.map((el, i) => {
        console.log(el)
        return(
          <div className="p-2 gap-2 grid grid-cols-10" key={i}>
            {/* <div className="p-2 col-span-2 cursor-pointer">{el.partner}</div> */}
            <div className="p-2 col-span-2 cursor-pointer">{el.contract.name} от {el.contract.date}</div>
            <div className="p-2 col-span-2 cursor-pointer">{el.name}</div>
            <div className="p-2 col-span-2 cursor-pointer">{el.date}</div>
            <div className="p-2 col-span-2 cursor-pointer">{el.accepted} or {el.rejected}</div>
            <div className="p-2 col-span-2 cursor-pointer">{el.comment}</div>
          </div>
        )
      })}
    </Layout>
  )
}

