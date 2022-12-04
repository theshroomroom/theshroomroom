import { getCsrfToken,getSession } from 'next-auth/react';
import {useState,FormEvent} from 'react';
import authenticate from '../../utils/authenticationRequired'
export default function ChangePassword(){
    const [currentPassword,setCurrentPassword] = useState<string>('');
    const [validateCurrentPassword,setValidateCurrentPassword]=useState<boolean|undefined>(undefined);
    const [newPassword,setNewPassword]=useState<string>('');
    const [validateNewPassword,setValidateNewPassword]=useState<boolean|undefined>(undefined)
    const [confirmPassword,setConfirmPassword]=useState<string>('');
    const [validateConfirmPassword,setValidateConfirmPassword]=useState<boolean|undefined>(undefined)
    const [passwordChanged,setPasswordChanged]=useState('');
    const [formError,setFormError]=useState('');
    const formValidated=()=>{
        const formInputs = document.querySelectorAll('.formInput')
        formInputs.forEach(el=>(el as HTMLElement).blur())
        if(validateNewPassword&&validateCurrentPassword&&validateConfirmPassword){
            return true;
        }
        return false;
    }
    const changePasswordHandler=async(e:FormEvent)=>{
        try{
            setFormError('')
            e.preventDefault()
            if(formValidated()){
                console.log('YEYHHH')
                const session = await getSession()
                const res = await fetch('/api/change-password',{
                    method: "PUT",
                    headers:{
                        csrftoken:await getCsrfToken() as string
                    },
                    body: JSON.stringify({
                        username:session?.user.email,
                        newPassword:newPassword,
                        currentPassword:currentPassword
                    })
    
                })
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
            <label htmlFor="currentPassword">Current password:</label>
            <input className="formInput" required type="password" name="" id="currentPassword" value={currentPassword} placeholder="type current password here" onChange={(e)=>setCurrentPassword(e.target.value)} onBlur={(e)=>e.target.value!==''?setValidateCurrentPassword(true):setValidateCurrentPassword(false)} />
            {validateCurrentPassword===false?<p>Enter a valid password</p>:null}
            <label htmlFor="newPassword">New password:</label>
            <input className="formInput" required type="password" name="newPassword" id="newPassword" value={newPassword} placeholder="enter new password here" onChange={(e)=>setNewPassword(e.target.value)} onBlur={(e)=>e.target.value!==''?setValidateNewPassword(true):setValidateNewPassword(false)} />
            {validateNewPassword===false?<p>Enter a valid password</p>:null}

            <label htmlFor="confirmPassword">Confirm Password:</label>

            <input className="formInput" required type="password" name="confirmPassword" id="confirmPassword" value={confirmPassword} placeholder="confirm password here" onChange={(e)=>setConfirmPassword(e.target.value)} onBlur={(e)=>e.target.value&&e.target.value===newPassword?setValidateConfirmPassword(true):setValidateConfirmPassword(false)} />
            {validateConfirmPassword===false?<p>Ensure your passwords are matching</p>:null}

            <button onClick={(e)=>changePasswordHandler(e)}>Change Password</button>
            
            <p id="message">{passwordChanged}{formError}</p>
        </form>
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