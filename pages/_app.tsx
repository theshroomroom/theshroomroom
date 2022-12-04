import '../styles/globals.css'
import {useState,useEffect, useReducer} from 'react';
import styles from '../styles/Pages/Home.module.css';
import Head from 'next/head';
import Header from '../components/header';
import Footer from '../components/footer';
import type { AppProps } from 'next/app'
import { SessionProvider,getSession, getCsrfToken } from "next-auth/react"
import {CartContext} from '../context/cart'
import {Product} from '../utils/types';
import { parseCookies,setCookie } from 'nookies';

interface useReducerState {
  total:number,
  subTotal:number,
  shipping: number,
  shippingMethod:string,
  cart : {
    items: Product[]
  },
  totalQuantity: number,
}
interface actionInterface {
  type:String,
  payload: {
    items: Product[]
  }
}
function reducer(state:useReducerState,action:actionInterface){
  switch(action.type){

    case "UPDATE_CART":
      console.log("PAAAAAYLOAAAAD",action.payload)
      var subTotal= action.payload.items.length>0?action.payload.items.reduce((a:number,b:Product)=>{
        return a+b.price*b.quantity;
      },0):0
      var totalQuantity = action.payload.items.length>0?action.payload.items.reduce((a:number,b:Product)=>{
        return a+b.quantity;
      },0):0
      return {
        cart: action.payload,
        subTotal: subTotal,
        shipping:state.shipping,
        shippingMethod:"Standard",
        total: subTotal+state.shipping,
        totalQuantity:totalQuantity
      }
    default:
      return state
  }
  
}
function MyApp({ Component, pageProps: {session,...pageProps} }: AppProps) {
  // const [cart,setCart] =useState<{items:Product[]}>({
  //   items: []
  // })
  const [state,dispatch] = useReducer(reducer, {
    cart: {
      items:[]
    } ,
    total:5,
    subTotal:0,
    shipping:5,
    shippingMethod:"Standard",
    totalQuantity:0


  })
  // const [total,setTotal]=useState(0);
  // const [subTotal,setSubTotal]=useState(0);
  // const [shipping,setShipping]=useState(5);
  const [loaded,setLoaded]=useState(false);
  console.log(pageProps)
    useEffect(()=>{
        const initializeCart=async()=>{
          try {
            const data=await getSession()
            console.log("data",data)
            if(data&&data.user&&data.user.cart){
                dispatch({
                  type:"UPDATE_CART",
                  payload:data.user.cart
                })
               
            }
            else {
                const {Cart} = parseCookies()
                console.log("cookie",Cart)
                if(Cart){
                    const cartItems = JSON.parse(Cart)
                    console.log(cartItems)
                    dispatch(({
                      type:"UPDATE_CART",
                      payload: cartItems
                    }))
                }
            }
            console.log('oioioioi')
            setLoaded(true)

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

          }
        }
        initializeCart()
    },[])
    const saveCart=async(product:Product)=>{
        try{
            const session = await getSession()
            const newCart:{
              items: Product[]
            } = {...state.cart}
            // console.log(newCart.items.filter(el=>el._id!==product.id))
            // console.log(product)
            if(newCart.items){
              if(product.quantity!==0){
                newCart.items=[...newCart.items.filter(el=>el._id!==product._id),product]
                console.log('not zero')
              }
              else {
                newCart.items=[...newCart.items.filter(el=>el._id!==product._id)]
                console.log('zero')
              }
              if(session&&session.user){
                console.log('req sent')
                  const csrftoken:string|undefined=await getCsrfToken()
                  if(!csrftoken){
                    throw new Error('No csurfin')
                  }
                  const res = await fetch('http://localhost:3000/api/editUser',{
                      method:"PUT",
                      headers:{
                        csrftoken:csrftoken
                      },
                      body: JSON.stringify({
                        username:session.user.email,
                        cart:newCart
                      })
                  })
                  if(!res){
                    throw new Error('Unable to update cart')
                  }
                  dispatch({
                    type:"UPDATE_CART",
                    payload:newCart
                  })
              }
              else{
                  console.log('local storage',newCart)
                  setCookie(null,"Cart",JSON.stringify(newCart))
                  dispatch({
                    type:"UPDATE_CART",
                    payload:newCart
                  })
              }
            }
            
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
            console.log(e)
        }
    }
  return (
    <SessionProvider session={session}>
      <CartContext.Provider value={{
                state,
                loaded,
                dispatch,
                setLoaded,
                saveCart,
            }}>
        <Header/>
          <Head>
            <title>The Shroom Room</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

        <main className={styles.main}>
          <div className={styles.container}>
            <Component {...pageProps} />
          </div>
        </main>
        <Footer/>
      </CartContext.Provider>
    
    </SessionProvider>
  )
}

export default MyApp