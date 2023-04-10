import MCTable from 'components/UI/MCTable'
import Search from 'components/UI/Search'
import {Spinner} from 'flowbite-react'
import { useState } from 'react'
import useSWR from 'swr'
export default function Mrp(){
    const [ name, setName ] = useState<string>('')

    const { data, isLoading } = useSWR(name ? `/api/osv/?mrp=${name}` : null)
    const { data: mrps, isLoading: isLoadingList } = useSWR(name ? `/api/osv/mrp/?name=${name}`: null)

    return (
        <div className="grid grid-cols-12">
            <div className='col-span-12'>
                <Search data={mrps} name={name} setName={setName} isLoading={isLoadingList}/>
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
