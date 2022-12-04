import { ifError } from 'assert';
import {useContext,useEffect,useState} from 'react';
import LoadingIndicator from '../components/loadingIndicator'
import {getSession} from 'next-auth/react'
import {CartContext} from '../context/cart'
import Link from 'next/link';
import Image from 'next/image';

import {imageMap} from '../utils/imageMap/imageMap';
interface Product{
    _id:String,
    name: string,
    quantity:number,
    price: number,
    image:string
}
export default function Cart(){
    let context=useContext(CartContext)
    useEffect(()=>{
        console.log(context)
        console.log(context.state.cart.items)
    })

    return(context.state.cart.items.length?
        <>
                    <h1>BASKET CASE</h1>
                        <div>
                            { 
                            context&&context.state.cart&&context.state.cart.items?
                                context.state.cart.items.map(({_id,name,quantity,price},idx:number)=>{
                                    return(
                                        <div key={name}>
                                            <h2 className="product-name">{name}</h2>
                                            
                                            {
                                                name?

                                                <Image className="product-image" width={imageMap[name].width} height={imageMap[name].height} src={`${imageMap[name].path}.${imageMap[name].fileType}`} alt={name}/>
                                                :
                                                null
                                            }
                                            <div>
                                            <span><b>Qty:</b> </span><select className="product-quantity"id={`quantity${idx}`}name={"quantity"} defaultValue={String(quantity)}>
                                                {
                                                    [1,2,3,4,5,6,7,8,9,10].map((el:number)=>{
                                                        return (
                                                            <option key={String(el)}value={String(el)}>{String(el)}</option>
                                                        )
                                                    })
                                                }

                                            </select>
                                            </div>
                                            <div>
                                            <button className="product-save" onClick={async(e)=>{
                                                const input = document.getElementById(`quantity${idx}`) as HTMLInputElement
                                                context.saveCart?
                                                context.saveCart({
                                                    _id:_id,
                                                    name:name,
                                                    quantity:Number(input.value),
                                                    price:Number(price)
                                                }):null}
                                            }>Save</button>
                                            <button className="product-delete"onClick={async(e)=>{
                                                console.log("id",_id)
                                                context.saveCart?
                                                context.saveCart({
                                                    _id:_id,
                                                    name:name,
                                                    quantity:0,
                                                    price: Number(price)
                                                }):null}
                                            }>Delete</button>
                                            </div>
                                            <p className="product-price"><b>Price: </b> £{quantity*price}</p>
                                        </div>
                                    )}
                                )
                                :null
                            }
                        <p><b>Sub-total: </b>{"£"+String(context.state.subTotal)}</p>
                      
                        <p><b>Shipping</b>{"£"+String(context.state.shipping)}</p>
                      
                        <p><b>Total</b>{"£"+String(context.state.total)}</p>
                        <Link  href="/checkout"><a id="checkout">Checkout</a></Link>
                            </div>
                        </>
                        :
        <h2>PLEASE ADD SOME SHROOMS TO YOUR BASKET</h2>
    )
}