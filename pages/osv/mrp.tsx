import MCTable from 'components/UI/MCTable'
import Search from 'components/UI/Search'
import {Spinner} from 'flowbite-react'
import { lowCostAccounts } from 'lib/consts'
import Head from 'next/head'
import { use, useEffect, useState } from 'react'
import useSWR from 'swr'
export default function Mrp(){
    const [ name, setName ] = useState<string>('')

    const { data, isLoading } = useSWR(name ? `/api/osv/?mrp=${name}` : null)
    const { data: list, isLoading: isLoadingList} = useSWR(`/api/osv/mrp`)
    const { data: date } = useSWR(`/api/osv/date`)
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <title>{name ? name : 'CРСС: МОЛ'}</title>
            </Head>
            <div className="grid grid-cols-12">
                <div className='col-span-12 mb-1'>
                    Выберите МОЛа:
                </div>
                <div className='col-span-12'>
                    <select disabled={isLoadingList} className='w-full rounded-lg border-gray-300' defaultValue={null} onChange={(e)=>setName(e.target.value)}>
                        {isLoadingList && <option value={null} className='w-full'>Загрузка...</option>}
                        {!list?.includes("") && <option value={null} className='w-full'></option>}
                        {list?.map((el, i) => {
                            return (
                                <option value={el} key={i} className='w-full'>{el}</option>
                            )
                        })}
                    </select>
                </div>
                <div className='col-span-12 pt-4 text-gray-400'>
                    Данные актуальны на: {date && new Date(date).toLocaleString('ru-Ru') }
                </div>
                {isLoading && 
                    <div className='col-span-12 text-center py-4'>
                        <Spinner size={'lg'} />
                    </div>
                }
                {!isLoading && data && <MCTable data={data.filter(el => lowCostAccounts.includes(el.acc))} title={'Малоценные средства'} />}
            </div>
        </>
    )
}
