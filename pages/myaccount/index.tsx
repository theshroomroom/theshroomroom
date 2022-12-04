import {FormEvent,useState} from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { signOut,useSession,getCsrfToken } from 'next-auth/react';
import authenticate from '../../utils/authenticationRequired';


export default function MyAccount(){
    const {data:session,status} = useSession();
    const [sure,updateSure]=useState(false);
    const [deleted,updateDeleted]=useState("");
    const [message,setMessage]=useState('');
    const deleteAccount=async(e:FormEvent)=>{
        try{
            if(session&&session.user&&session.user.email){
                const res = await fetch('api/deleteaccount/',{
                    method:"DELETE",
                    body:JSON.stringify({
                        email:session.user.email
                    })
                })
                const resp=await res.json();
                if(resp.body.error){
                    updateDeleted("Sorry we were unable to delete your account, please try again later.")
                }
                else {
                    updateDeleted("Your account was successfully deleted.")
                }
                signOut({
                    callbackUrl: `${window.location.origin}`
                  })
    
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
            setMessage('We\'re sorry something has gone wrong. Please try again later')
        }
       
    }
    return(
        <>
            <h1>My account</h1>
            <Link href="/myaccount/edit" >Edit Details</Link>
            <Link href="/myaccount/orders">Orders</Link>
            <Link href="/myaccount/change-password">Change Password</Link>
            <button id="deleteAccount"onClick={(e)=>{
                updateSure(true)
            }}>Delete account</button>
            {
                sure?
                <div id="deleteAccountModal">
                    <p>Are you sure you wish to delete your account?</p>
                    <button className="modal-buttons"id="confirmDeleteAccount"onClick={(e)=>deleteAccount(e)}>Yes</button>
                    <button className="modal-buttons"id="cancelDeleteAccount" onClick={(e)=>updateSure(false)}>No</button>
                </div>:
                null
            }
            {
                deleted!==""?
                <>
                <p>{message}</p>
                <p>{deleted}</p>
                </>:
                null
            }
        </>
    )
}

export async function getServerSideProps(ctx:any){

    return await authenticate(ctx,({sesh}:any)=>{
        return {
            props: sesh
        }
    })
}