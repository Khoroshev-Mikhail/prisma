import MCTable from 'components/UI/MCTable'
import Search from 'components/UI/Search'
import { Label, Select, Spinner, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
export default function Stock(){
    const [ name, setName ] = useState<string>('')

    const { data, isLoading } = useSWR(name ? `/api/osv/?stock=${name}` : null)
    const { data: list } = useSWR(`/api/osv/stocks`)

    return (
        <div className="grid grid-cols-12">
            <div className='col-span-12'>
            {list && 
                <select className='w-full rounded-lg border-gray-300' defaultValue={null} onChange={(e)=>setName(e.target.value)}>
                    <option value={null}></option>
                    {list.map((el, i) => {
                        return (
                            <option value={el.name} key={i}>{el.name}</option>
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
            {!isLoading && data && <MCTable data={data.filter(el => el.acc == '10.01')} title={'Основные средства'} />}
            {!isLoading && data && <MCTable data={data.filter(el => el.acc == '10.04')} title={'Инструмент'} />}
            {!isLoading && data && <MCTable data={data.filter(el => el.acc == '10.08')} title={'Малоценные средства'} />}
            {!isLoading && data && <MCTable data={data.filter(el => el.acc != '10.01' && el.acc != '10.04' && el.acc == '10.08')} title={'Другое'} />}

        </div>
    )
}
