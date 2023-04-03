import { Label, Select, Spinner, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
export default function Account04({ acc } : { acc: string }){
    const [ name, setName ] = useState<string>('')
    const [ visible, setVisible ] = useState<boolean>(false)

    const { data, isLoading } = useSWR(name ? `/api/osv/?acc=10.01&mrp=${name}` : null)
    const { data: mrps } = useSWR(name ? `/api/osv/mrp?name=${name}` : null)

    function setSearch({target: { value }}){
        setVisible(true)
        setName(value)
    }
    function clickSearch(e){
        if(e.target.id !== "search-mrp"){
            setVisible(false)
        }
    }
    useEffect(()=>{
        addEventListener('click', clickSearch)
        return ()=>{
            removeEventListener('click', clickSearch)
        }
    },[])

    return (
        <div className="grid grid-cols-12">
            <div className='col-span-12'>
                <div className='w-full'>
                    <Label htmlFor="search-mrp">МОЛ:</Label>
                    <TextInput className='w-full' value={name} id="search-mrp" onChange={setSearch} autoComplete='off'/>
                    {visible && <div className='absolute w-[97.7%] bg-white py-2 border rounded-md'>
                        {mrps?.map((el, i) => {
                            return(
                                <div key={i} onClick={()=>setName(el.name)} className='ml-2 cursor-pointer hover:underline hover:bg-slate-50'>
                                    {el.name}
                                </div>
                            )
                        })}
                    </div>}
                </div>
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
