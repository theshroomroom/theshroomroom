import React from 'react';
import Image from 'next/image';
import Link from 'next/link'
import {useState} from 'react';
interface ImageType {
    name:string,
    alt:string,
    path: string,
    fileType: string,
    link: string,
    width:number,
    height:number
}
export default function Carousel(props:any){
    const [indexArray,setIndexArray] = useState(props.imageProps.map((el:ImageType,idx:number)=>{
        return idx-1}))
    function slide(forward:Boolean) {
        if(forward){
            setIndexArray(indexArray.map((el:number,idx:number)=>{
                if(el===indexArray.length-2){
                    return -1
                }
                else {
                    return el+=1
                }
            }))
        }
        else {

            setIndexArray(indexArray.map((el:number,idx:number)=>{
                if(el===-1){
                    return indexArray.length-2
                }
                else {
                    return el-=1
                }
            }))

        }
    }
    return(
        <div className="carousel-container">
            <div className="carousel-left carousel-button"onClick={()=>slide(true)}></div>
            <div className="carousel-slide-wrap">
                    {
                        indexArray?
                    props.imageProps.map(({alt,path,fileType,name,link,width,height}:ImageType,idx:number)=>{
                        console.log(name)
                        return(
                            
                            <div key={idx}className="carousel-image-wrap" style={{transform: `translateX(${indexArray[idx]*60}vw`}}>
                                <Link href={`/products/${name.replace(/[\s]/gi,'-').replace(/['\'']/gi,'&apos')}`} >
                                    <a>
                                        <Image className={"carousel-image"} objectFit="contain"  layout="fill" key={idx} alt={alt} src={path+'.'+fileType}/>    
                                    </a>
                                </Link>
                            </div>
                        )}
                    ):
                    null
                    }
            </div>
            <div className="carousel-right carousel-button" onClick={()=>slide(false)}></div>
        </div>
    )
}