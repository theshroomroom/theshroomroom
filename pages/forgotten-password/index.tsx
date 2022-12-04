import {useState,FormEvent} from 'react'
import {getCsrfToken} from 'next-auth/react'

export default function ForgottenPassword(){
    const [email,setEmail]=useState('');
    const [validateEmail,setValidateEmail]=useState('');
    const [formSubmitted,setFormSubmitted]=useState(false);
    const handleForgotten=async(e:FormEvent)=>{
        console.log('KLASDJGKLAG')
        try{
            e.preventDefault();
            if(email!==''){
                setValidateEmail('');
              
                const res = await fetch('/api/reset-password',{
                    method: "POST",
                    headers: {
                        csrftoken: await getCsrfToken() as string
                    },
                    body: JSON.stringify({
                        username:email
                    })
                })
                const response = await res.json()

                if(response.error){
                    setValidateEmail(response.error)
                }
                else {
                    setFormSubmitted(true)
                }
    
            }
            else {
                setValidateEmail('Enter an email to continue')
            }

        }
        catch(e:any){
            await fetch('/api/clientSideError',{
              method:"POST",
              headers: {
                  "csrftoken": await getCsrfToken() as string,
                  "client-error": "true"
              },
              body:JSON.stringify({
                  error:e.message,
                  stack:e.stack
              })
          })
            
        }
    }
    return(
        <>
            {
                !formSubmitted?
<>
            <p>To reset your password, enter your email address and send</p>
            <form>
            <input required id="email" name="email" value={email}type="email" placeholder="Type email address here"onChange={(e)=>setEmail(e.target.value)}/>
            <p>{validateEmail}</p>
            <button  onClick={(e)=>handleForgotten(e)}>Submit</button>
        </form></>:
        <p>A password reset link has been sent to the email address provided.</p>

            }
        </>
    )
}