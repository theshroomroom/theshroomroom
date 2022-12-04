import {signIn,getCsrfToken} from "next-auth/react";
import {useState, FormEvent} from 'react';
import Router from 'next/router';

export default function SignUp(){
    const [name,setName]=useState('');
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [message,setMessage]=useState('');
    const signupUser=async(e:FormEvent)=>{
        try{
            e.preventDefault();
            const csrftoken = await getCsrfToken()
            if(!csrftoken){
                throw new Error('No csurfin')
            }
            const res = await fetch('/api/register', {
                method:"POST",
                headers: {
                    "csrftoken":csrftoken,
                    "Content-Type":'appication/json'
                },
                body: JSON.stringify({name,username,password})
            })
            let data=await res.json()
            if(data.message){
                setMessage(data.message)
            }
            if(data.message=="Registered successfully"){
                let options= {redirect:false,username,password}
                await signIn("credentials",options)
                Router.push('/')
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
        <form onSubmit={(e)=>signupUser(e)}>
            <label htmlFor="name">Name</label>
            <input required id="name" type="text" value={name} onChange={e=>setName(e.target.value)}/>
            <label htmlFor="username">Username</label>
            <input required id="username" type="email" value={username} onChange={e=>setUsername(e.target.value)}/>
            <label htmlFor="password">Password</label>
            <input required id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
            <button id="submit" type="submit" value="submit" >Submit</button>
            {/* <button id="googleSignUp">Sign up with Google</button> */}
            <p>
                {message}
            </p>
        </form>
    )
}

