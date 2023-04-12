import { Label, Spinner, TextInput } from "flowbite-react"
import { useEffect, useRef, useState } from "react"

export default function Search({ data, state, setState,  placeholder, isLoading, autofocus }){
    const [ visible, setVisible ] = useState<boolean>(false)
    const ref = useRef(null)
    function setSearch({ target: {value}}){
        setVisible(true)
        setState(value)
    }
    function clickSearch(e){
        if(e.target.id !== "search-mrp"){
            setVisible(false)
        }
    }
    useEffect(()=>{
        if(autofocus){
            ref.current.focus()
        }
        addEventListener('click', clickSearch)
        return ()=>{
            removeEventListener('click', clickSearch)
        }
    },[])
    return (
        <div className='w-full'>
            {/* <Label htmlFor="search-mrp">{label}</Label> */}
            <input ref={ref} type="tel" inputMode="numeric" className='w-full bg-white rounded-lg border-gray-300' value={state} id="search-mrp" onChange={setSearch} autoComplete='off' placeholder={placeholder}/>
            {visible && 
                <div className='absolute w-[92%] bg-white py-2 border rounded-md'>
                    {isLoading && <Spinner className="ml-2" />}
                    {!isLoading && data?.map((el, i) => {
                        return(
                            <div key={i} onClick={()=>setState(el.bp)} className='ml-2 cursor-pointer hover:underline hover:bg-slate-50'>
                                {el.bp} {el.name}
                            </div>
                        )
                    })
                }
                </div>
            }
        </div>
    )
}