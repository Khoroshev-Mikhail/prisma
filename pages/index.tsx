import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
export default function Index(){

    const { data, isLoading } = useSWR(`/api/osv/`)
    useEffect(()=>{
        if(data){
            const ara = data.map(el => el.acc)
            const set = new Set(ara)
        }
    }, [data])
    return (
        <div className="grid grid-cols-12">
        </div>
    )
}
