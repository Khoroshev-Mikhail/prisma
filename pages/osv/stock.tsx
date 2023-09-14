import MCTable from 'components/UI/MCTable'
import Search from 'components/UI/Search'
import { Label, Select, Spinner, TextInput } from 'flowbite-react'
import { MC04Account, OCAccount, lowCostAccounts } from 'lib/consts'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
export default function Stock(){
    const router = useRouter()
    const { name: URLname  } = router.query
    const [ name, setName ] = useState<string>( URLname as string || '')
    
    const [ OC, setOC ] = useState<any[]>([])
    const [ MC04, setMC04 ] = useState<any[]>([])
    const [ lowCost, setLowCost ] = useState<any[]>([])
    const [ other, setOther ] = useState<any[]>([])
    

    const { data, isLoading } = useSWR(name ? `/api/osv/?stock=${name}` : null)
    const { data: list, isLoading: isLoadingList } = useSWR(`/api/osv/stock`)
    const { data: date } = useSWR(`/api/osv/date`)

    function select({target: { value }}){
        if(value){
            setName(value)
            router.push(`?name=${value}`);
        } else{
            setName(null)
            router.push('')
        }
    }

    useEffect(()=>{
        if(data){
            setLowCost(data.filter(el => lowCostAccounts.includes(el.acc)))
            setMC04(data.filter(el => el.acc === MC04Account))
            setOC(data.filter(el => el.acc === OCAccount))
            setOther(data.filter(el => el.acc !== OCAccount && el.acc !== MC04Account && !lowCostAccounts.includes(el.acc)))
        }
    }, [data])
    useEffect(()=>{
        if(URLname && URLname !== ''){
            setName(URLname as string)
        }
        if(!URLname || URLname == ''){
            setName('0')
            console.log('ar')
        }
    }, [URLname, router.query.name])
    
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <title>CРСС: Склад</title>
            </Head>
            <div className="flex flex-col">
                <div className='w-full mb-1'>
                    Выберите склад:
                </div>
                <div className='w-full'>
                    <select disabled={isLoadingList}  className='w-full rounded-lg border-gray-300' defaultValue={URLname as string || null} onChange={select}>
                        {isLoadingList && <option value={null} className='w-full'>Загрузка...</option>}
                        {!list?.includes("") && <option value={null} className='w-full'></option>}
                        {list?.map((el, i) => {
                            return (
                                <option value={el} key={i} className='w-full' selected={URLname === el}>{el}</option>
                            )
                        })}
                    </select>
                </div>
                <div className='w-full pt-4 text-gray-400'>
                    Данные актуальны на: {date && new Date(date).toLocaleString('ru-Ru') }
                </div>
                {name && 
                    <div className='w-full h-full flex flex-col gap-y-4'>
                        {isLoading && 
                            <div className='w-full text-center'>
                                <Spinner size={'lg'} />
                            </div>
                        }
                        {lowCost.length > 0 && <MCTable data={lowCost} title={'Малоценные средства'} />}
                        {MC04.length > 0 && <MCTable data={MC04} title={'Инструмент МЦ.04'} />}
                        {OC.length > 0 && <MCTable data={OC} title={'Основные средства'} />}
                        {other.length > 0 && <MCTable data={other} title={'Другое'} />}
                    </div>
                }
            </div>
        </>
    )
}
