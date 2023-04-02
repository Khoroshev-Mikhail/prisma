import React, { useEffect, useState } from "react"
import { GetServerSideProps } from "next"
import prisma from './../lib/prisma';
import Layout from "./../components/layout/Layout";
import { Button, TextInput} from "flowbite-react";
import useSWR from 'swr'
import Link from "next/link";
import { Partner } from "@prisma/client";
import Image from "next/image";
import ErrorPlug from "./../components/layout/ErrorPlug";
import LoadingPlug from "./../components/layout/LoadingPlug";
import { useSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async () => {
  const partners = await prisma.partner.findMany()
  return {
    props: {
      fallbackData: JSON.parse(JSON.stringify(partners))
    },
  }
}
const ara = [{"acc":"10.01","name":"Полипласт ФОРМ тип 3 жидкий","stock":"РБУ Бетонный з-д Строит уч №3(ОП УС3Москва-Казань)","qty":"1,72"},{"acc":"10.01","name":"Крышка для отверстия 38мм к дюбелю 3Д-1","stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","qty":"791"},{"acc":"10.01","name":"Шайба из листа 20мм 140х140 с отверстием д-51мм/Ст.3/без зачистки,без покраски  (Б.Камень якоря)","stock":"Внутриплощадочный склад № 3","qty":"15"},{"acc":"10.01","name":"Дюбель 3Д-1 с отверстием 38мм","stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","qty":"791"},{"acc":"10.01","name":"Арматура АIII (А400)d18*11700мм","stock":"НЗП Внутриплощадочный склад № 1","qty":"1,152"},{"acc":"10.01","name":"ОБВ (опора быстро возводимая)","stock":"Отдел энергетика Строит уч №2 (ОП Москва-Казань)","qty":"3"},{"acc":"10.01","name":"Лист Г/К 8.0 1500х 6000 ст3сп/пс5 (ГОСТ 14637-89,НЛМК)","stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","qty":"5,5"},{"acc":"10.01","name":"Система выравнивания плитки Клин д/зажима Флажок/Кольцо/Квадрат 1уп/50шт (БК 1)","stock":"Внутриплощадочный склад № 1","qty":"160"},{"acc":"10.01","name":"Лист Г/К 8.0 1500х 6000 ст3сп/пс5 (ГОСТ 14637-89,НЛМК)","stock":"НЗП Строительный участок Мамыри (Тюленева)","qty":"6,881"},{"acc":"10.01","name":"Бокс с прозрачной крышкой КМПн 2/4 для 4-х авт. выкл. наружной установки (БК 2)","stock":"Внутриплощадочный склад № 3","qty":"5"},{"acc":"10.01","name":"Клей резиновый ТюбингГлю TG-300 (WS)","stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","qty":"2 914"},{"acc":"10.01","name":"Опора быстро возмодимая № 3 (ОБВ) 6 м","stock":"АБЗ Строит уч№4 (ОП УС№3 Москва-Казань с.Яново)","qty":"2"},{"acc":"10.01","name":"Заглушка к дюбелю 3Д-1 с уплотнительным кольцом","stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","qty":"791"},{"acc":"10.01","name":"Каркас арматурный плоский Кр7 РД 191209-1-КЖ1.1","stock":"Строительный участок - г. Благовещенск","qty":"8 122"},{"acc":"10.01","name":"Труба гофрированная 110 (БК 2)","stock":"Внутриплощадочный склад № 3","qty":"6"},{"acc":"10.01","name":"Штанга направляющая 40х500","stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","qty":"100"},{"acc":"10.01","name":"Шайба из листа 12мм 80х80 с отверстием д-27мм/Ст.3/без зачистки,без покраски  (Б.Камень якоря)","stock":"Внутриплощадочный склад № 3","qty":"16"},{"acc":"10.01","name":"Лента защитная (ЛЗУС 25х12)","stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","qty":"4 199"},{"acc":"10.01","name":"MasterEmaco N1100 Tix W/Мастер Эмако N1100 Тикс W Сухая ремонтная смесь (30)кг.","stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","qty":"3 203"},{"acc":"10.01","name":"Арматура АIII (А400)d22*11700мм","stock":"НЗП Внутриплощадочный склад № 1","qty":"0,18"},{"acc":"10.01","name":"Линамикс Р жидкий  РБУ","stock":"Склад: пос. Краснопахорское, кв-л. 147, уч. Вл. 1","qty":"4,184"},{"acc":"10.01","name":"Обратный клапан к дюбелю 3Д-1","stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","qty":"791"},{"acc":"10.01","name":"Система выравнивания плитки Зажим Флажок 1,4 мм 1уп/300шт (БК 1)","stock":"Внутриплощадочный склад № 1","qty":"27"},{"acc":"10.01","name":"Шайба из листа 20мм 80х80 с отверстием д-27мм/Ст.3/без зачистки,без покраски  (Б.Камень якоря)","stock":"Внутриплощадочный склад № 3","qty":"30"},{"acc":"10.01","name":"Дюбель ДРП-1,1","stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","qty":"1 438"},{"acc":"10.01","name":"Основание операторской АБЗ (М-12 Строит.площ. №3 с.Яново)","stock":"АБЗ Строит уч№4 (ОП УС№3 Москва-Казань с.Яново)","qty":"1"}]
export default function PartnerPage({fallbackData}:{fallbackData: Partner[]}){
  const {data: session} = useSession()
  const [filterName, setFilterName] = useState('')
  const [filterInn, setFilterInn] = useState('')
  const [comparator, setComparator] = useState<{sortBy: 'id' | 'name' | 'inn', isOrderByAsc: boolean}>({sortBy: 'name', isOrderByAsc: true})
  const {data, error, isLoading} = useSWR<Partner[]>(`/api/partners/?name=${filterName}&inn=${filterInn}&sortBy=${comparator.sortBy}&orderBy=${comparator.isOrderByAsc ? 'asc' : 'desc'}`, {fallbackData})
  useEffect(()=>{
    fetch('/api/osv', {
      method: 'POST',
      body: JSON.stringify({body: ara, token: process.env.TOKEN })
    })
  },[])
  return (
      <Layout>
          {ara[0].acc}
      </Layout>
  )
}

