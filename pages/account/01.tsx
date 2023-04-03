import OSV from 'components/UI/osv'
import { Label, Select, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
export default function Account01(){
    const search = useRef(null)
    const [ name, setName ] = useState<string>('')

    const { data, mutate } = useSWR(name ? `/api/osv/?acc=10.01&mrp=${name}` : null)
    const { data: mrps, } = useSWR(name ? `/api/osv/mrp?name=${name}` : null)

    return (
        <OSV acc={"10.01"}/>
    )
}