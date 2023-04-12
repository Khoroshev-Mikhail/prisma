import MCTable from 'components/UI/MCTable'
import Search from 'components/UI/Search'
import { Label, Select, Spinner, TextInput } from 'flowbite-react'
import { lowCostAccounts } from 'lib/consts'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
export default function Stock(){
    const [ name, setName ] = useState<string>(null)

    const { data, isLoading } = useSWR(name ? `/api/osv/?stock=${name}` : null)
    const { data: list } = useSWR(`/api/osv/stocks`)

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <title>CРСС: Склад</title>
            </Head>
            <div className="grid grid-cols-12">
                <div className='col-span-12'>
                {list && 
                    <select className='w-full rounded-lg border-gray-300' value={name} onChange={(e)=>setName(e.target.value)}>
                        {!list.includes("") && <option value={null}></option>}
                        {list.map((el, i) => {
                            return (
                                <option value={el} key={i}>{el}</option>
                            )
                        })}
                    </select>
                }
                    {/* <Search data={mrps} name={name} setName={setName}/> */}
                </div>
                {isLoading && 
                    <div className='col-span-12 text-center py-4'>
                        <Spinner size={'lg'} />
                    </div>
                }
                {!isLoading && data && <MCTable data={data} title={'Малоценные средства'} />}
            </div>
        </>
    )
}
