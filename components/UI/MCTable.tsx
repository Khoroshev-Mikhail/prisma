export default function MCTable({ data, title }){
    return (
        // <>
        //     {data.length > 0 &&
                <>
                    <div className='col-span-12'>
                        {title}:
                    </div>
                    <div className='col-span-12 grid grid-cols-12 bg-gray-100 border'>
                            <div className='col-span-1 row-span-2 md:row-span-1 flex flex-col justify-center md:pl-2'>
                                <div className="text-center md:text-left">№</div>
                            </div>
                            <div className='col-span-11 md:col-span-6'>Наименование</div>
                            <div className='col-span-5 md:col-span-2'>БП</div>
                            <div className='col-span-3 md:col-span-1 text-right'>Ед.изм.</div>
                            <div className='col-span-3 md:col-span-2 text-right pr-2'>Кол-во</div>
                    </div>
                    {data?.map((el, i) => {
                        return (
                            <div className='col-span-12 grid grid-cols-12 border-b border-l border-r even:bg-white odd:bg-slate-50' key={i}>
                                <div className='col-span-1 row-span-2 md:row-span-1 flex flex-col justify-center md:pl-2'>
                                    <div className="text-center md:text-left">{i+1}</div>
                                </div>
                                <div className='col-span-11 md:col-span-6'>{el.name}</div>
                                <div className='col-span-5 md:col-span-2'>{el.bp}</div>
                                <div className='col-span-3 md:col-span-1 text-right'>{el.unit}</div>
                                <div className='col-span-3 md:col-span-2 text-right pr-2'>{el.qty}</div>
                            </div>
                        )
                    })}
                </>
        //     }
        // </>
    )
}