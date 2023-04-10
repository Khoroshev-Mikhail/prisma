import Search from 'components/UI/Search'
import { Label, Select, Spinner, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
export default function Account01({ acc } : { acc: string }){
    const [ name, setName ] = useState<string>('')

    const { data, isLoading } = useSWR(name ? `/api/osv/?acc=10.01&mrp=${name}` : null)
    const { data: mrps } = useSWR(name ? `/api/osv/mrp?name=${name}` : null)

    return (
        <div className="grid grid-cols-12">
            <div className='col-span-12'>
                {/* <Search data={mrps} name={name} setName={setName}/> */}
            </div>
            <div className='col-span-12 mt-4'>
                Основные средства:
            </div>
            {isLoading && 
                <div className='col-span-12 text-center py-4'>
                    <Spinner size={'lg'} />
                </div>
            }
            {!isLoading && data &&
                <div className='col-span-12 grid grid-cols-12 bg-gray-100 border'>
                    <div className='col-span-2 pl-2'>№</div>
                    <div className='col-span-10 md:col-span-2'>БП</div>
                    <div className='col-span-12 md:col-span-8 pr-2 pl-2 md:pl-0'>Наименование</div>
                </div>
            }
            {!isLoading && data?.map((el, i) => {
                return (
                    <div className='col-span-12 grid grid-cols-12 border-b border-l border-r even:bg-white odd:bg-slate-50' key={i}>
                        <div className='col-span-2 pl-2'>{i + 1}</div>
                        <div className='col-span-10 md:col-span-2'>{el.bp}</div>
                        <div className='col-span-12 md:col-span-8 pr-2 pl-2 md:pl-0'>{el.name} asdasdas dasdasda dasdas das das das das das dasdasdasdasdasd asdasdasdasdas das</div>
                    </div>
                )
            })}
        </div>
    )
}
