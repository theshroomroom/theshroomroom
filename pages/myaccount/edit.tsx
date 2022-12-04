import {useState, useEffect, FormEvent} from 'react';
import {getCsrfToken, getSession,signIn} from 'next-auth/react';
import LoadingIndicator from '../../components/loadingIndicator';
import authenticate from '../../utils/authenticationRequired';

export default function Edit(){
    const [loading, setLoading]=useState(true);
    const [dFirstName,setDFirstName]=useState('');
    const [dSurname,setDSurname]=useState('');
    const [dFirstLine,setDFirstLine]=useState('');
    const [dSecondLine,setDSecondLine]=useState('');
    const [dCity,setDCity]=useState('');
    const [dPostcode,setBPostcode]=useState('');
    const [bFirstName,setBFirstName]=useState('');
    const [bSurname,setBSurname]=useState('');
    const [bFirstLine,setBFirstLine]=useState('');
    const [bSecondLine,setBSecondLine]=useState('');
    const [bCity,setBCity]=useState('');
    const [bPostcode,setDPostcode]=useState('');
    const [updates,setUpdates]=useState(false);
    const [user,setUser]=useState({})
    const [message,setMessage]=useState('')
    useEffect(()=>{
        const securePage=async()=>{
            const session = await getSession()
            if(!session){
                signIn()
            }
            else {
                fetch(`http://localhost:3000/api/getUser/${session.user.email}`)
                .then((res)=>{
                    return res.json()
                })
                .then((res)=>{
                        console.log(res)
                        // for(var i:Number=0;i<objkeys.length;i++){
                        //     console.log(document.getElementById(objkeys[i]))
                        //     console.log(document.getElementById(objkeys[i]).value)
                        //     document.getElementById(objkeys[i]).value=res.user.address[objkeys[i]]
                        // }
                        setUser(res.user)
                        setDFirstName(res.user.dAddress.surname);
                        setDSurname(res.user.dAddress.surname);
                        setDFirstLine(res.user.dAddress.firstLine);
                        setDSecondLine(res.user.dAddress.secondLine);
                        setDCity(res.user.dAddress.city);
                        setDPostcode(res.user.dAddress.postcode);
                        setBFirstName(res.user.bAddress.surname);
                        setBSurname(res.user.bAddress.surname);
                        setBFirstLine(res.user.bAddress.firstLine);
                        setBSecondLine(res.user.bAddress.secondLine);
                        setBCity(res.user.bAddress.city);
                        setBPostcode(res.user.bAddress.postcode);
                        setUpdates(res.user.updates)
                })
                setLoading(false)
            }
        }
        securePage()
            

        

    },[])
    async function editUser(e:FormEvent){
        try{
            e.preventDefault()
            const body = {
                ...user,
                dAddress:
                {
                    firstName:dFirstName,
                    surname: dSurname,
                    firstLine: dFirstLine,
                    secondLine:dSecondLine,
                    city:dCity,
                    postcode:dPostcode
                },
                bAddress:
                {
                    firstName:bFirstName,
                    surname: bSurname,
                    firstLine: bFirstLine,
                    secondLine:bSecondLine,
                    city:bCity,
                    postcode:bPostcode
                },
                updates:updates
            }
            console.log(body)
            // const requestHeaders: HeadersInit = new Headers();
            const csrftoken =await getCsrfToken()
            if(!csrftoken){
                throw new Error('Csrf token failure, no csrfin')
            }
            const res = await fetch('http://localhost:3000/api/editUser',{
                method:"POST",
                headers: {
                    csrftoken: csrftoken
                },
                body: JSON.stringify(body)
            })
            setMessage('Successfully updated profile')
            setTimeout((e)=>{
                setMessage('')
            },1500)

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
            setMessage('We\'re sorry something has gone wrong. Please try again later')
        }
    }

    return(
        <>
        {
            loading?
            <LoadingIndicator />
            :
            <>
            <h2>Edit details</h2>
            <form action="">
                <h2>Delivery Address</h2>
                <label htmlFor="dFirstName">First Name</label>
                <input  id="dFirstName" value={dFirstName} onChange={(e)=>setDFirstName(e.target.value)}/>
                <label htmlFor="dSurname">Surname</label>
                <input id="dSurname" value={dSurname} onChange={(e)=>setDSurname(e.target.value)}/>
                <label htmlFor="dFirstLine">Street name and number</label>
                <input id="dFirstLine1" value={dFirstLine} onChange={(e)=>setDFirstLine(e.target.value)}/>
                <label htmlFor="dSecondLine">2nd Line of address</label>
                <input id="dSecondLine" value={dSecondLine} onChange={(e)=>setDSecondLine(e.target.value)}/>
                <label htmlFor="dCity">City</label>
                <input id="dCity" value={dCity} onChange={(e)=>setDCity(e.target.value)}/>
                <label htmlFor="dPostcode">Postcode</label>
                <input id="dPostcode" value={dPostcode} onChange={(e)=>setDPostcode(e.target.value)}/>
                <label htmlFor="updates">Receive updates</label>
                <input id="updates" type="checkbox" onChange={(e)=>setUpdates(e.target.checked)}/>
                <h2>Billing Address</h2>
                <label htmlFor="bFirstName">First Name</label>
                <input  id="bFirstName" value={bFirstName} onChange={(e)=>setBFirstName(e.target.value)}/>
                <label htmlFor="bSurname">Surname</label>
                <input id="bSurname" value={bSurname} onChange={(e)=>setBSurname(e.target.value)}/>
                <label htmlFor="bFirstLine">Street name and number</label>
                <input id="bFirstLine1" value={bFirstLine} onChange={(e)=>setBFirstLine(e.target.value)}/>
                <label htmlFor="bSecondLine">2nd Line of address</label>
                <input id="bSecondLine" value={bSecondLine} onChange={(e)=>setBSecondLine(e.target.value)}/>
                <label htmlFor="bCity">City</label>
                <input id="bCity" value={bCity} onChange={(e)=>setBCity(e.target.value)}/>
                <label htmlFor="bPostcode">Postcode</label>
                <input id="bPostcode" value={bPostcode} onChange={(e)=>setBPostcode(e.target.value)}/>
                <button type="submit" onClick={(e)=>editUser(e)}>Submit</button>
            </form>
            {
                message?

            <p>{message}</p>:
            null
            }
            </>
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