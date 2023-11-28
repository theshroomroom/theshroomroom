import '../styles/global.css'
import {Signika,Dosis} from 'next/font/google'
import {useState,useEffect, useReducer} from 'react';
import styles from '../styles/Pages/Home.module.css';
import Header from '../components/header';
import Footer from '../components/footer';
import Loading from '../components/loadingIndicator'
import Subscription from '../components/home_page/subscribe'
import type { AppProps } from 'next/app'
import { SessionProvider,getSession, getCsrfToken } from "next-auth/react"
import {CartContext} from '../context/cart'
import {Product} from '../utils/types';
import { parseCookies,setCookie,destroyCookie } from 'nookies';

const signika = Signika({
  subsets: ["latin"],
  weight: '600'
})
const dosis = Dosis({
  subsets:["latin"],
  weight: "400"
})
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
  const [componentLoading,setComponentLoading]=useState(false);
  const [cartLoaded,setCartLoaded]=useState(false);
    useEffect(()=>{
        const initializeCart=async()=>{
          try {
            const data=await getSession()
            if(data&&data.user&&data.user.cart){
                dispatch({
                  type:"UPDATE_CART",
                  payload:data.user.cart
                })
               
            }
            else {
                const {Cart} = parseCookies()
                if(Cart){
                    const cartItems = JSON.parse(Cart)
                    dispatch(({
                      type:"UPDATE_CART",
                      payload: cartItems
                    }))
                }
            }
            setCartLoaded(true)
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
    const saveCart=async(product?:Product)=>{
        try{
          const session = await getSession()
          if(product){
            const newCart:{
              items: Product[]
            } = {...state.cart}
              if(newCart.items){
                if(product.quantity!==0){
                  newCart.items=[...newCart.items.filter(el=>{
                    return el._id!==product._id||el.fresh!==product.fresh||el.size!==product.size
                  }),product]
                }
                
                else {
                  newCart.items=[...newCart.items.filter(el=>el._id!==product._id)]
                }
                if(session&&session.user){
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
                    setCookie(null,"Cart",JSON.stringify(newCart),{
                      path: '/cart'
                    })
                    dispatch({
                      type:"UPDATE_CART",
                      payload:newCart
                    })
                }
              }
            }
            else {
              let newCart:{
                items: Product[]
              }={
                items:[]
              };
              console.log(newCart)
              if(session&&session.user){
                const csrftoken:string|undefined=await getCsrfToken()
                if(!csrftoken){
                  throw new Error('No csurfin')
                }
                console.log('errr hello?')
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
                console.log(res)
                if(!res){
                  throw new Error('Unable to update cart')
                }

            }
            destroyCookie({},"Cart",{
              path: '/cart'
            })
            dispatch({
              type:"UPDATE_CART",
              payload:newCart
            })
            
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
      <style jsx global>{`
        :root {
          --signika-font: ${signika.style.fontFamily};
          --dosis-font: ${dosis.style.fontFamily};
        }
      `}</style>
      <CartContext.Provider value={{
                state,
                dispatch,
                saveCart,
                cartLoaded,
                setCartLoaded,
            }}>
        <Header/>
          {/* <Head>
            <title>Mega Mushrooms</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />

          </Head> */}

        <main className="main">
          <Loading componentLoading={componentLoading} />
          <div className={styles.container}>
            <Component {
              ...pageProps
              }
              componentLoading={componentLoading}
              setComponentLoading={setComponentLoading} />
          </div>
          <Subscription/>
        </main>
        <Footer/>
      </CartContext.Provider>
    
    </SessionProvider>
  )
}

export default MyApp