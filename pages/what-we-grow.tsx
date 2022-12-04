import {useState,useEffect} from 'react';

export default function WhatWeGrow(props:any) {
    const [mushArr,setMushArr] = useState([])
    // useEffect(()=>{
    //     setMushArr(props)
    // },[])

    return (
        <>
            <h1>What we grow</h1>
            <ul>
                {/* {
                    mushArr.map((el,idx)=>{
                        return(
                            <li>
                                <h2>{el.name}</h2>
                                <p>{el.longDescription}</p>

                            </li>
                        )
                    })
                } */}
            </ul>
        </>
    )
}

export async function getStaticProps(){
    return {
        props:{
            mushies:[]
        }
    }
}