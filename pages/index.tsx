import React, { useEffect } from "react"
import { GetServerSideProps } from "next"
import prisma from './../lib/prisma';
import Layout from "./../components/layout/Layout";


// let test = []
// for(let i = 1; i <= 1000; i++){
//   test.push({"acc":`10.${Math.floor(i / 100)}`,"ara":"accdesc","name":`Мат.цен.${i}`,"stock":`Склад${Math.floor(i / 100)}`,"mrp":`Мол ${Math.floor(i / 100)}`,"unit":"kg","qty":`${i}`})
// }
const ara = {"body":[
  {"bp":"bp000","acc":"10.01","acc_name":"accdesc","name":"nametest1","stock":"склад","mrp":"Мол","unit":"kg","qty":"11"},
  {"bp":"bp000","acc":"10.01","acc_name":"accdesc1","name":"nametest2","stock":"склад","mrp":"Мол2","unit":"kg","qty":"11"},
  {"bp":"bp000","acc":"10.01","acc_name":"accdesc2","name":"nametest3","stock":"склад","mrp":"Мол","unit":"kg","qty":"11"},
  {"bp":"bp000","acc":"10.01","acc_name":"accdesc3","name":"nametest4","stock":"склад","mrp":"Мол","unit":"kg","qty":"11"},
  {"bp":"bp000","acc":"10.01","acc_name":"accdesc4","name":"nametest5","stock":"склад","mrp":"Мол","unit":"kg","qty":"11"},
  {"bp":"bp000","acc":"10.01","acc_name":"accdesc5","name":"nametest6","stock":"склад","mrp":"Мол","unit":"kg","qty":"11"},
  {"bp":"bp000","acc":"10.01","acc_name":"accdesc6","name":"nametest7","stock":"склад","mrp":"Мол","unit":"kg","qty":"11"},
  {"bp":"bp000","acc":"10.01","acc_name":"accdesc7","name":"nametest8","stock":"склад","mrp":"Мол","unit":"kg","qty":"11"}
],"token":"123CRCC123"}
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

