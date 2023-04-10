import { Label, Spinner, TextInput } from "flowbite-react"
import { useEffect, useState } from "react"

export default function Search({ data, name, setName, isLoading }){
    const [ visible, setVisible ] = useState<boolean>(false)
    function setSearch(name){
        setVisible(true)
        setName(name)
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
        <div className='w-full'>
            <Label htmlFor="search-mrp">МОЛ:</Label>
            <TextInput className='w-full' value={name} id="search-mrp" onChange={(e)=>setSearch(e.target.value)} autoComplete='off'/>
            {visible && 
                <div className='absolute w-[97.7%] bg-white py-2 border rounded-md'>
                    {isLoading && <Spinner color={'pink'} />}
                    {!isLoading && data &&
                        data.map((el, i) => {
                            return(
                                <div key={i} onClick={()=>setName(el.name)} className='ml-2 cursor-pointer hover:underline hover:bg-slate-50'>
                                    {el.name}
                                </div>
                            )
                        })
                }
                </div>
            }
        </div>
    )
}