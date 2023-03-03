import { Button, Spinner } from "flowbite-react";
import Link from "next/link";
import { ks3Ext } from "../../pages/ks3";
import useSWRMutation from 'swr/mutation'
import { updateApi } from "../../lib/APIFns";
import { useSession } from "next-auth/react";
import { KeyedMutator } from "swr";
import Image from "next/image";
import { useState } from "react";
//const date = new Date(props.date).toLocaleDateString() по поводу ошибок 418 425 423 - так не сработает
export default function Ks3Row({...props}:ks3Ext & {mutate: KeyedMutator<ks3Ext[]>}){
    const [isLoading, setLoading] = useState<boolean>(false)
    const {data: session} = useSession()
    const {trigger} = useSWRMutation(`/api/ks3/${props.id}`, updateApi)

    async function handlerAccepted(val: boolean | null){
        setLoading(true)
        const formData = new FormData()
        formData.append('id', String(props.id))
        if(val === true){
            formData.append('accepted', 'null')
        }
        if(!val){
            formData.append('accepted', 'true')
        }
        await trigger(formData)
        await props.mutate()
        setLoading(false)
    }
    async function handlerRejected(val: boolean | null){
        setLoading(true)
        const formData = new FormData() 
        formData.append('id', String(props.id))
        if(val === false){
            formData.append('accepted', 'null')
        }
        if(val === true || val === null){
            formData.append('accepted', 'false')
        }
        await trigger(formData)
        await props.mutate()
        setLoading(false)
    }
    return (
        <div className="py-2 grid grid-cols-12 border-t border-gray-200">
            <div className="p-2 col-span-2 border-r border-gray-200">{props.name}</div>
            <div className="p-2 col-span-2 border-r border-gray-200">{new Date(props.date).toLocaleDateString()}</div>
            <div className="p-2 col-span-2 border-r border-gray-200">{props.contract.name}</div>
            <div className="px-2 col-span-2 border-r border-gray-200 flex justify-center">
                {isLoading 
                    ?
                        <Spinner size="xl" />
                    :
                    <Button.Group>
                        <Button onClick={()=>handlerAccepted(props.accepted)} color={props.accepted === true ? 'success' : 'gray'} className="w-1/2">
                            {props.accepted === true ? 'Принят' : 'Принять'}
                        </Button>
                        <Button onClick={()=>handlerRejected(props.accepted)} color={props.accepted === false ? 'failure' : 'gray'} className="w-1/2">
                            {props.accepted === false ? 'Отклонён' : 'Отклонить'}
                        </Button>
                    </Button.Group>
                }
            </div>
            <div className="p-2 col-span-1 border-r border-gray-200 flex justify-evenly">
                <Link href={''}><Image className="inline-block" src="/images/eye.svg" alt='arrow' width={30} height={30} /></Link>
                <Link href={''}><Image className="inline-block" src="/images/archive-box-arrow-down.svg" alt='arrow' width={30} height={30} /></Link>
            </div>
            <div className="p-2 col-span-2 border-r border-gray-200">{props.comment}</div>
            <div className="p-2 col-span-1 text-center"><Link href={`/ks3/edit/${props.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-500">Edit</Link></div>
        </div>
      )
}