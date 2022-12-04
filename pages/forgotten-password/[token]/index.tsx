import { getCsrfToken } from 'next-auth/react';
import {useRouter} from 'next/router';
import {useState,FormEvent} from 'react';


export default function ResetPassword(){
    const [email,setEmail] = useState<string>('');
    const [validateEmail,setValidateEmail]=useState<boolean|undefined>(undefined);
    const [password,setPassword]=useState<string>('');
    const [validatePassword,setValidatePassword]=useState<boolean|undefined>(undefined)
    const [confirmPassword,setConfirmPassword]=useState<string>('');
    const [validateConfirmPassword,setValidateConfirmPassword]=useState<boolean|undefined>(undefined)
    const [passwordChanged,setPasswordChanged]=useState('');
    const [formError,setFormError]=useState('');
    const formValidated=()=>{
        const formInputs = document.querySelectorAll('.formInput')
        formInputs.forEach(el=>(el as HTMLElement).blur())
        if(validatePassword&&validateEmail&&validateConfirmPassword){
            return true;
        }
        return false;
    }
    const router = useRouter();
    const token = router.query.token
    console.log(token)
    const changePasswordHandler=async(e:FormEvent)=>{
        try{
            setFormError('')
            e.preventDefault()
            if(formValidated()){
                console.log('YEYHHH')
                const res = await fetch('/api/change-password-forgotten',{
                    method: "PUT",
                    headers:{
                        csrftoken:await getCsrfToken() as string
                    },
                    body: JSON.stringify({
                        username:email,
                        passwordResetToken:token,
                        password:password
                    })
    
                })
                console.log('sup')
                const resJson = await res.json()
                if(resJson.error){    
                    throw new Error(resJson.error)
                }
                else {
                    setPasswordChanged('Password successfully changed')
                }
            }
            else {
                setFormError('Please enter form details correctly')
            }

        }
        catch(e:any){
            console.log(e);
            setFormError(e.message);
        }
    }
    return(
        <>
        <h1>Reset your password</h1>
        <form>
            <label htmlFor="email">Email address:</label>
            <input className="formInput" required type="email" name="email" id="email" value={email} placeholder="type email here" onChange={(e)=>setEmail(e.target.value)} onBlur={(e)=>e.target.checkValidity()?setValidateEmail(true):setValidateEmail(false)} />
            {validateEmail===false?<p>Enter a valid email</p>:null}
            <label htmlFor="password">Password:</label>
            <input className="formInput" required type="password" name="password" id="password" value={password} placeholder="enter password here" onChange={(e)=>setPassword(e.target.value)} onBlur={(e)=>e.target.value!==''?setValidatePassword(true):setValidatePassword(false)} />
            {validatePassword===false?<p>Enter a valid password</p>:null}

            <label htmlFor="confirmPassword">Confirm Password:</label>

            <input className="formInput" required type="password" name="confirmPassword" id="confirmPassword" value={confirmPassword} placeholder="confirm password here" onChange={(e)=>setConfirmPassword(e.target.value)} onBlur={(e)=>e.target.value&&e.target.value===password?setValidateConfirmPassword(true):setValidateConfirmPassword(false)} />
            {validateConfirmPassword===false?<p>Ensure your passwords are matching</p>:null}

            <button onClick={(e)=>changePasswordHandler(e)}>Change Password</button>
            
            <p>{passwordChanged}{formError}</p>
        </form>
        </>
    )
}
