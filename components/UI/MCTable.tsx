import { useState } from "react"

export default function MCTable({ data, title }){
    const [ isOpen, setIsOpen ] = useState<boolean>(false)

    return (
        <div className="w-full flex flex-col">
            <div className="flex justify-between bg-gray-100 border-x border-t px-2 font-semibold py-0.5">
                <div className=''>
                    {title} ({data.length} шт.):
                </div>
                {/* <div onClick={()=>setIsOpen(!isOpen)}>
                    +
                </div> */}
            </div>
            
            <div className='w-full grid grid-cols-12 bg-gray-100 border py-0.5'>
                <div className='col-span-1 row-span-2 md:row-span-1 flex flex-col justify-center md:pl-2'>
                    <div className="text-center md:text-left">№</div>
                </div>
                <div className='col-span-11 md:col-span-6'>Наименование</div>
                <div className='col-span-5 md:col-span-2'>БП</div>
                <div className='col-span-6 md:col-span-3 text-right pr-2'>Кол-во</div>
            </div>
            {/* {isOpen && */}
                <div className="w-full grid grid-cols-12">
                    {data?.map((el, i) => {
                        return (
                            <div className='col-span-12 grid grid-cols-12 py-0.5 border-b border-l border-r even:bg-white odd:bg-slate-100' key={i}>
                                <div className='col-span-1 row-span-2 md:row-span-1 flex flex-col justify-center md:pl-2'>
                                    <div className="text-center md:text-left truncate">{i+1}</div>
                                </div>
                                <div className='col-span-11 md:col-span-6'>{el.name}</div>
                                <div className='col-span-5 md:col-span-2'>{el.bp}</div>
                                <div className='col-span-6 md:col-span-3 text-right pr-2'>{el.qty} {el.unit}</div>
                            </div>
                        )
                    })}
                </div>
            {/* } */}
        </div>
    )
}