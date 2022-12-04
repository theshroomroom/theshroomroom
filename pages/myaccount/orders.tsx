import { getCsrfToken, getSession } from "next-auth/react";
import {Session} from 'next-auth';
import {useRouter} from "next/router";
import { useEffect,useState,FormEvent } from "react";
import authenticate from '../../utils/authenticationRequired';

export default function MyAccountOrders(){
    const [orders,setOrders]=useState([])
    const [cancelOrderId,setCancelOrderId]=useState('');
    const [cancelError, setCancelError]=useState<string|null>(null)
    const [error,setError]=useState<string|null>(null)
    const router = useRouter()
    useEffect(()=>{
        const initiate=async()=>{
            try{
                const sesh = await getSession()
                if(!sesh){
                    throw new Error("You should be logged in to view this page")
                }
                await getOrders(sesh)

            }
            catch(e:any){
                console.log(e)
                router.push("/")
            }
        }
        initiate()
    },[])
    async function getOrders(sesh:Session){
        try{
            const orderData = await fetch(`/api/order/?id=${sesh.user.id}`,{
                method:"GET"
            })
            const orderDataJson = await orderData.json()
            setOrders(orderDataJson.orders)

        }
        catch(e:any){
            await fetch('/api/clientSideError',{
                method:"POST",
                headers: {
                    "csrfToken": await getCsrfToken() as string,
                    "client-error": "true"
                },
                body:JSON.stringify({
                    error:e.message,
                    stack:e.stack
                })
            })
            setError(e)

        }

    }
    async function cancelOrder(e:FormEvent){
        try{
            e.preventDefault()
            const csrftoken=await getCsrfToken()
            if(!csrftoken){
                throw new Error("No csrfin here")
            }
            const res = await fetch('/api/order',{
                method:"DELETE",
                headers: {
                    csrftoken: csrftoken
                },
                body: JSON.stringify({
                    _id: cancelOrderId
                })
            })
            const json = await res.json()
            if(json.success){
                showCancelledModal(true)
            }
            else {
                setCancelError('Cancel fucked')
            }

        }
        catch(error:any){
            
            await fetch('/api/clientSideError',{
                method:"POST",
                headers: {
                    "csrfToken": await getCsrfToken() as string,
                    "client-error": "true"
                },
                body:JSON.stringify({
                    error:error.message,
                    stack:error.stack
                })
            })
            setError(error)
        }

    }
    function showModal(open:boolean,id:string){
        try{
            var modal = document.querySelector(`.cancel-modal`)
            if(open){
                modal?.classList.remove("hidden")
                
            }
            else {
                modal?.classList.add("hidden")
            }
            setCancelOrderId(id)

        }
        catch(e:any){

            setError(e)
        }
    }
    function showCancelledModal(open:boolean){
        try{
            var modal = document.querySelector(`.cancelled-modal`)
            if(open){
                modal?.classList.remove("hidden")
                
            }
            else {
                modal?.classList.add("hidden")
            }

        }
        catch(e:any){

            setError(e)
        }
    }
    return(
        <>
        <h1>MY Orders</h1>
        {
        error?
            <p>{error}</p>:
            null    
        }
        <div className={`cancel-modal hidden`}>
                            <p>Are you sure you&apos;d like to cancel this order?</p>
                            <button onClick={(e)=>{
                                cancelOrder(e)
                            }}>Yes</button>
                            <button onClick={(e)=>{
                                showModal(false,'')
                            }}>No</button>
                            {
                                cancelError?
                                <p>{cancelError}</p>:null
                            }

        </div>
        <div className={'.cancelled-modal hidden'}>
            <p>Your order has been cancelled</p>
            <button onClick={(e)=>showCancelledModal(false)}>ok</button>
        </div>
        {
            orders.length?
            orders.map(({_id,},idx)=>{
                return(
                    <div key={idx}>
                        
                        <p>{_id}</p>
                        <button onClick={(e)=>{
                            showModal(true,_id)
                        }}>Cancel</button>

                    </div>
                )
            }):null
        }

        </>
    )
}
export async function getServerSideProps(ctx:any){

    return authenticate(ctx,({sesh}:any)=>{
        return {
            props: sesh
        }
    })
}