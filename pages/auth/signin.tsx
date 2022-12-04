import {useState,FormEvent} from 'react';
import {signIn,getCsrfToken} from 'next-auth/react';
import Link from 'next/link'
export default function SignIn(){
    const [username,setUsername] =useState('');
    const [password,setPassword]= useState('');
    const [message,setMessage] =useState<string|null>(null);
    const signInUser=async(e:FormEvent) => {
        try {
            e.preventDefault();
            let options = {redirect:false,username,password}
    
            const res= await signIn("credentials",options);
            setMessage(null);
            if(res?.error) {
                console.log('YEEEEEEEEEEEEEEE')
                setMessage(res.error)
            }
            else{
                return window.location.href="/"
    
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
                    <form method="POST">
                        <label htmlFor="username">Username</label>
                        <input id="username" type="email" placeholder="Enter email here" value={username} onChange={e =>setUsername(e.target.value)}/>
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" placeholder="Enter password here" value={password} onChange={e=>setPassword(e.target.value)}/>
                        <button onClick={async(e)=>await signInUser(e)}type="submit">Sign In</button>
                        <Link href="/forgotten-password"><a>forgotten password?</a></Link>
                        
                    </form>
                    <p style={{color:"red"}}>{message}</p>
                    </>
    )
}
