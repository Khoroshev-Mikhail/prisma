import MCTable from 'components/UI/MCTable'
import Search from 'components/UI/Search'
import { Label, Select, Spinner, TextInput } from 'flowbite-react'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
export default function Bp(){
    const [ bp, setBp ] = useState<string>('')
    const { data, isLoading } = useSWR(bp ? `/api/osv/bp/?bp=${bp}` : null)
    function bpReplace(bp){
        setBp(bp.replace(/\D/gi, ''))
    }
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <title>CРСС: поиск БП</title>
            </Head>
            <div className="grid grid-cols-12">
                <div className='col-span-12'>
                    Поиск по инвентарному номеру (БП-0000ХХХ):
                </div>
                <div className='col-span-12 mb-4'>
                    <Search data={data} state={bp} setState={bpReplace} placeholder="Введите только цифры, например: 1605" isLoading={isLoading}/>
                </div>
                {data &&
                    <div className='col-span-12 grid grid-cols-12 bg-gray-100 border'>
                        <div className='col-span-1 row-span-4 flex flex-col justify-center md:pl-2'>
                            <div className="text-center md:text-left">№</div>
                        </div>
                        <div className='col-span-11'>Наименование</div>
                        <div className='col-span-11'>Мол</div>
                        <div className='col-span-11'>Склад</div>
                        <div className='col-span-5 md:col-span-2'>БП</div>
                        <div className='col-span-3 md:col-span-1 text-right'>Ед.изм.</div>
                        <div className='col-span-3 md:col-span-2 text-right pr-2'>Кол-во</div>
                    </div>
                }
                {data?.map((el, i) => {
                    return (
                        <div className='col-span-12 grid grid-cols-12 border-b border-l border-r even:bg-white odd:bg-slate-50' key={i}>
                            <div className='col-span-1 row-span-4 flex flex-col justify-center md:pl-2'>
                                <div className="text-center md:text-left truncate">{i+1}</div>
                            </div>
                            <div className='col-span-11'>{el.name}</div>
                            <div className='col-span-11'>{el.mrp}</div>
                            <div className='col-span-11'>{el.stock}</div>
                            <div className='col-span-5'>{el.bp}</div>
                            <div className='col-span-6 text-right pr-2'>{el.qty} {el.unit}</div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}
