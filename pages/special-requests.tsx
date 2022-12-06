import {FormEvent,useState} from 'react';
import {getCsrfToken} from 'next-auth/react';

export default function SpecialRequests(){
    async function submitSpecialRequest(e:FormEvent){
        // const [request,setRequest]=useState('');
        const res = await fetch('/api/specialRequest',{
            method:"POST",
            headers: {
                csrftoken: await getCsrfToken() as string
            },
            body: JSON.stringify({

            })
        })
    }
    return(
        <>
        <h1>Special Requests</h1>
        <p>You name it and we&apos;ll grow it (if it&apos;s legal). Before you send this request, be sure to identify whether the mushroom you want us to grow is mycorhizzal / requires a sybiotic relationship with specific roots before growth. If your mushroom does meet our criteria, we will grow it as soon as possible!</p>
        <h2>Curent culture collection</h2>

        <ul>
            <li>Lions Mane</li>
            <li>Reishi</li>
            <li>Turkey Tail</li>
            <li>Cordyceps</li>
        </ul>
        <form>
            <input placeholder="Name" />
            <textarea placeholder="Insert request" onChange={(e)=>{

            }}></textarea>
            {/* <button onClick={(e)=>submitSpecialRequest(e)}>Submit</button> */}
        </form>
        </>
        )
    }