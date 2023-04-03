import { Label, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
export default function Account01(){
    const [ name, setName ] = useState<string>('')
    const { data, mutate } = useSWR(name ? `/api/osv/?acc=10.01&mrp=${name}` : null)
    useEffect(()=>{
        mutate()
    },[name])
    return (
        <div className="grid grid-cols-12">
            <div className='col-span-12'>
                <div className='w-full'>
                    <Label htmlFor="search-mrp">МОЛ:</Label>
                    <TextInput className='w-full' id="search-mrp" onChange={ (e)=> setName(e.target.value)}/>
                </div>
            </div>
            <div className='col-span-12 mt-4'>
                Основные средства:
            </div>
            <div className='col-span-12 grid grid-cols-12 bg-gray-100 border'>
                <div className='col-span-2 pl-2'>№</div>
                <div className='col-span-10 md:col-span-2'>БП</div>
                <div className='col-sapn-12 md:col-span-8 pr-2'>Наименование</div>
            </div>
            {data && data.map((el, i) => {
                return (
                    <div className='col-span-12 grid grid-cols-12 border-b border-l border-r' key={i}>
                        <div className='col-span-2 pl-2'>{i + 1}</div>
                        <div className='col-span-10 md:col-span-2'>{el.bp}</div>
                        <div className='col-sapn-12 md:col-span-8 pr-2'>{el.name}</div>
                    </div>
                )
            })}
 
        </div>
    )
}