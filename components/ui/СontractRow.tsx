import { Button } from "flowbite-react";
import Link from "next/link";
import useSWRMutation from 'swr/mutation'
import { updateApi } from "../../lib/fnsAPI";
import { useSession } from "next-auth/react";
import { ContractExt } from "../../pages/contracts";
import { mutate } from "swr";

export default function ContractRow({...props}:any){
    const {data: session} = useSession()
    const {trigger} = useSWRMutation(`/api/contracts/${props.id}`, updateApi)

    return (
        <div className="py-2 grid grid-cols-12 border-t border-gray-200">
            
        </div>
      )
}