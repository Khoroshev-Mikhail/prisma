import React, { useEffect } from "react"
import { GetServerSideProps } from "next"
import prisma from './../lib/prisma';
import Layout from "./../components/layout/Layout";


// let test = []
// for(let i = 1; i <= 1000; i++){
//   test.push({"acc":`10.${Math.floor(i / 100)}`,"ara":"accdesc","name":`Мат.цен.${i}`,"stock":`Склад${Math.floor(i / 100)}`,"mrp":`Мол ${Math.floor(i / 100)}`,"unit":"kg","qty":`${i}`})
// }

export default function PartnerPage(){
  // useEffect(()=>{
  //   fetch('/api/osv', {
  //     method: 'POST',
  //     body: JSON.stringify({body: test, token: "123CRCC123" })
  //   })
  // },[])
  return (
      <div>
          test
      </div>
  )
}

