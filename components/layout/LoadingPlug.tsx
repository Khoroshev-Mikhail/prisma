import { Spinner } from "flowbite-react";

export default function LoadingPlug(){
    return(
        <div className="w-full flex justify-center p-10">
            <Spinner size="xl" />
        </div>
    )
}