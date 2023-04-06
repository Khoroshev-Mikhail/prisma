import { Label, Select, Spinner, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
export default function Account08({ acc } : { acc: string }){
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
                Малоценные средства:
            </div>
            {isLoading && 
                <div className='col-span-12 text-center py-4'>
                    <Spinner size={'lg'} />
                </div>
            }
            {!isLoading && data &&
                <div className='col-span-12 grid grid-cols-12 bg-gray-100 border'>
                    <div className='col-span-1 row-span-2 md:row-span-1 content-center items-center text-center align-middle'>№</div>
                    <div className='col-span-11 md:col-span-6'>Наименование</div>
                    <div className='col-span-5 md:col-span-2'>БП</div>
                    <div className='col-span-3 md:col-span-1 text-right'>Ед.изм.</div>
                    <div className='col-span-3 md:col-span-2 text-right pr-2'>Кол-во</div>
                </div>
            }
            {!isLoading && data?.map((el, i) => {
                return (
                    <div className='col-span-12 grid grid-cols-12 border-b border-l border-r even:bg-white odd:bg-slate-50' key={i}>
                        <div className='col-span-1 row-span-2 md:row-span-1 content-center items-center text-center'>{i+1}</div>
                        <div className='col-span-11 md:col-span-6'>{el.name}</div>
                        <div className='col-span-5 md:col-span-2'>{el.bp}</div>
                        <div className='col-span-3 md:col-span-1 text-right'>{el.unit}</div>
                        <div className='col-span-3 md:col-span-2 text-right pr-2'>{el.qty}</div>
                    </div>
                )
            })}
        </div>
    )
}
