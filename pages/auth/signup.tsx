import {signIn,getCsrfToken} from "next-auth/react";
import {useState, FormEvent} from 'react';
import Router from 'next/router';
import Head from 'next/head';
import FormComponent from "../../components/form-component";
import {Metadata} from '../../utils/metadata/metadata'

import styles from '../../styles/Components/Form.module.css'
export default function SignUp({setComponentLoading}:any){
    const [name,setName]=useState('');
    const [nameVal,setNameVal]=useState('');
    const [username,setUsername]=useState('');
    const [usernameVal,setUsernameVal]=useState('');
    const [password,setPassword]=useState('');
    const [passwordVal,setPasswordVal]=useState('');
    const [message,setMessage]=useState('');
    const [user,setUser]=useState('');
    const [updates,setUpdates]=useState(true)
    const signupUser=async(e:FormEvent)=>{
        try{
            setComponentLoading(true)
            e.preventDefault();
            const csrftoken = await getCsrfToken()
            if(!csrftoken){
                setMessage('No csurfin')
            }
            const res = await fetch('/api/register', {
                method:"POST",
                headers: {
                    "csrftoken":csrftoken as string,
                    "Content-Type":'appication/json'
                },
                body: JSON.stringify({name,username,password,updates})
            })
            let data=await res.json()
            setComponentLoading(false)
            if(data.message){
                setMessage(data.message)
            }
            if(data.message=="Registered successfully"){
                let options= {redirect:false,username,password}
                await signIn("credentials",options)
                Router.push('/')
            }
            else {
                setMessage(data.error)
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
            setComponentLoading(false)
        }
        


    }
    return(
        <div className="static-container">
            <Head>
                <title>{Metadata["signup"]["title"]}</title>
                <meta name="description" content={Metadata["signup"]["description"]}/>
                <meta property="og:title" content={Metadata["signup"]["title"]}/>
                <meta property="og:description" content={Metadata["signup"]["description"]}/>
            </Head>
        <h1 className="main-heading center">Sign Up</h1>
        <form className={styles["form"]} onSubmit={(e)=>signupUser(e)}>
            <FormComponent user={user} labelName={"Name"}variable={name} variableName={Object.keys({name})[0]} setVariable={setName} variableVal={nameVal} setVariableVal={setNameVal} inputType={"text"} required={true}/>
            <FormComponent user={user} labelName={"Email"}variable={username} variableName={Object.keys({username})[0]} setVariable={setUsername} variableVal={usernameVal} setVariableVal={setUsernameVal} inputType={"email"} required={true}/>
            <FormComponent user={user} labelName={"Password"}variable={password} variableName={Object.keys({password})[0]} setVariable={setPassword} variableVal={passwordVal} setVariableVal={setPasswordVal} inputType={"password"} required={true}/>
            <div className={styles["form-element-wrapper"]+" add-vertical-margin"}>
                    <label className={styles["form-label"]} style={{"display":"inline-block"}} htmlFor="updates">Join our mailing list</label>
                    <input  autoComplete="complete" id="updates" type="checkbox" value={String(updates)} checked={updates}onChange={(e) => setUpdates(e.target.checked)} />
                </div>
            <button id="signUp" className="cta" type="submit" value="submit" >Submit</button>
            {/* <button id="googleSignUp">Sign up with Google</button> */}
            <p>
                {message}
            </p>
        </form>
        </div>
    )
}

