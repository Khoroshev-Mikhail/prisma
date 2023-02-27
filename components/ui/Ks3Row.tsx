import { Button } from "flowbite-react";
import Link from "next/link";
import { ks3Ext } from "../../pages/ks3";
import useSWRMutation from 'swr/mutation'
import { updateApi } from "../../lib/fnsAPI";
import { useSession } from "next-auth/react";

type incomingProps = ks3Ext & {
    mutate: any
}

export default function Ks3Row({...props}:incomingProps){
    const {data: session} = useSession()
    const {trigger} = useSWRMutation(`/api/ks3/${props.id}`, updateApi)

    async function handlerAccepted(val: boolean | null){
        const formData = new FormData()
        formData.append('id', String(props.id))
        formData.append('email', String(session.user.email))
        if(val === true){
            formData.append('accepted', '')
            await trigger(formData)
            await props.mutate()
        }
        if(!val){
            formData.append('accepted', 'true')
            await trigger(formData)
            await props.mutate()
        }
    }
    async function handlerRejected(val: boolean | null){
        const formData = new FormData()
        formData.append('id', String(props.id))
        formData.append('email', String(session.user.email))
        if(val === false){
            formData.append('accepted', '')
            await trigger(formData)
            await props.mutate()
        }
        if(val === true || val === null){
            formData.append('accepted', 'false')
            await trigger(formData)
            await props.mutate()
        }
    }
    return (
        <div className="py-2 grid grid-cols-12 border-t border-gray-200">
            <div className="p-2 col-span-2 border-r border-gray-200">{props.name}</div>
            <div className="p-2 col-span-2 border-r border-gray-200">{new Date(props.date).toLocaleDateString()}</div>
            <div className="p-2 col-span-2 border-r border-gray-200">{props.contract.name}</div>
            <div className="p-2 col-span-2 border-r border-gray-200 flex justify-center">
              <Button.Group>
                  <Button onClick={()=>handlerAccepted(props.accepted)} color={props.accepted === true ? 'success' : 'gray'} className="w-1/2">
                        {props.accepted === true ? 'Принят' : 'Принять'}
                  </Button>
                  <Button onClick={()=>handlerRejected(props.accepted)} color={props.accepted === false ? 'failure' : 'gray'} className="w-1/2">
                        {props.accepted === false ? 'Отклонён' : 'Отклонить'}
                  </Button>
              </Button.Group>
            </div>
            <div className="p-2 col-span-1 border-r border-gray-200 text-center">Скачать</div>
            <div className="p-2 col-span-2 border-r border-gray-200">{props.comment}</div>
            <div className="p-2 col-span-1 text-center"><Link href={`/ks3/edit/${props.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-500">Edit</Link></div>
        </div>
      )
}