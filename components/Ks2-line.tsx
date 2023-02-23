import { Button, TextInput } from "flowbite-react"
import { useState } from "react"

export default function Ks2line(props: any){
    const [comment, setComment] = useState<string>(props.comment || '')
    return(
        <div className="px-4 pt-4 my-2 gap-2 grid grid-cols-10 border-t-2">
            <div className="col-span-2 cursor-pointer">{props.ks3.name} от {props.ks3.date}</div>
            <div className="col-span-2 cursor-pointer">{props.name}</div>
            <div className="col-span-2 cursor-pointer">{props.date}</div>
            <div className="col-span-2 cursor-pointer">
                <Button.Group>
                <Button color={props.accepted ? 'success' : 'gray'}>
                    Принять
                </Button>
                <Button color={props.rejected ? 'failure' : 'gray'} disabled={comment.length == 0}>
                    Отклонить
                </Button>
                </Button.Group>
            </div>
            <div className="col-span-2 cursor-pointer"><TextInput value={comment} onChange={(e) => setComment(e.target.value)}/></div>
        </div>
    )
}