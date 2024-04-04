
import { loadStripe } from '@stripe/stripe-js';
import {Metadata} from '../utils/metadata/metadata';
import Head from 'next/head';
import {
    Elements
  } from "@stripe/react-stripe-js";
import Stripe from "stripe";
import {useEffect} from 'react'
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );
// import {useEffect,useContext} from 'react';
import {parseCookies, setCookie,destroyCookie} from 'nookies'
import CheckoutForm from '../components/checkout-form'
import connect from '../utils/connection'
import getShipping from '../utils/getShipping'
import { getSession, getCsrfToken } from 'next-auth/react';
import { Product } from '../utils/types'
import * as Schema from '../utils/schema' 
import { v4 as uuidv4 } from 'uuid';
import {authOptions} from './api/auth/[...nextauth]'

export default function Checkout(props:any){
    
    // const context = useContext(CartContext);
    var options = {
        clientSecret:''
    }
    if(props.paymentIntent){
        options.clientSecret=props.paymentIntent.client_secret
        
    }
    

        useEffect(()=>{
            if(props.refresh){

                window.location.href=`/`
            }
            else {

            }
        },[])

    
    
   
    
    return(
            <>
                <Head>
                    <title>Mega Mushrooms - rare, healthy, London grown lion's mane mushrooms</title>
                    <meta name="description" content="Discover the Power of Lion's Mane Mushrooms! 🍄 Elevate your well-being with our premium Lion's Mane mushrooms - nature's brain booster and immunity enhancer. Handpicked for quality and potency, our organic Lion's Mane products are a natural path to mental clarity and vitality. Explore our range of fresh and dried Lion's Mane mushrooms today and experience the unmatched benefits of this extraordinary fungi. Your journey to optimal health starts here."/>
                    <meta property="og:title" content="Mega Mushrooms - buy our high quality lion's mane mushrooms here"/>
                    <meta property="og:description" content="Reap the rewards of adding this healthy, medicinal and delicious mushroom to your diet"/>
                </Head>
                <Elements stripe={stripePromise} options={options} >
                    <CheckoutForm paymentIntent={props.paymentIntent}  setComponentLoading={props.setComponentLoading} subscriptionId={props.subscriptionId}/>
                </Elements>
            </>
    )
}
async function getPaymentIntentSubscription(sesh:any,stripe:any,Cart:any,shippingCost:number,subscriptionId:string,ctx:any,start:any){
    console.log('im in')
    console.log("6: " +(start-Date.now())/1000)
    var stripeCustomerId= sesh?.user.stripeCustomerId||undefined
    var standardShippingPriceId = process.env.STRIPE_SHIPPING_ID;
    let items
    if(sesh&&sesh.user&&sesh.user.cart){
        items = sesh.user.cart.items.map(async(el:any)=>{
            return {
                price_data:{
                    product: el.stripeId,
                    currency:"GBP",
                    recurring:{
                        interval: "month",
                        interval_count:1,
                    },
                    unit_amount:Math.round(el.price*100)
                },
                quantity:el.quantity
            }
        })

    }
    else if(Cart) {
        items = await JSON.parse(Cart).items.map(async(el:any)=>{
            console.log(el.stripeId)
            return {
                price_data:{
                    product: el.stripeId,
                    currency:"GBP",
                    recurring:{
                        interval: "month",
                        interval_count:1,
                    },
                    unit_amount:Math.round(el.price*100)
                },
                quantity:el.quantity
            }
        })
    }

    console.log("7: " +(start-Date.now())/1000)
    if(!sesh&&!Cart){
        return {
            props:{
                refresh:true
            },
        };
    }
    items.push({
        price_data:{
            product: standardShippingPriceId,
            currency:"GBP",
            recurring:{
                interval: "month",
                interval_count:1,
            },
            unit_amount:shippingCost*100
        },
        quantity:1,
    })

    items= await Promise.all(items) as any

    console.log("8: " +(start-Date.now())/1000)
    var checkoutSession = await stripe.subscriptions.create({
        customer: sesh?.user.stripeCustomerId as string,
        items: items,
        payment_behavior:"default_incomplete",
        payment_settings:{
            payment_method_types:["card"],
            save_default_payment_method:"on_subscription"
        },
        expand:["latest_invoice.payment_intent"]
    })

    console.log("9: " +(start-Date.now())/1000)
    var subscription_id=checkoutSession.id;
    var latestInvoice = checkoutSession.latest_invoice as any
    setCookie(ctx,'checkoutDetails',JSON.stringify({paymentIntentId:latestInvoice.payment_intent.id as string,subscriptionId:subscription_id}),{
        path:'/checkout'
    })

    console.log("10: " +(start-Date.now())/1000)
    console.log(latestInvoice.payment_intent.client_secret)
    return {
        props: {
            paymentIntent:latestInvoice.payment_intent,
            subscriptionId:subscriptionId
        }
    }
}
export const getServerSideProps =  async(ctx:any) => {
    const {req,res} = ctx;
    try {
        console.log('here we go')
        var start = Date.now()
        const secret_key = process.env.STRIPE_SECRET_KEY as string;
        var stripe = new Stripe(secret_key,{
            apiVersion:"2022-08-01",
            maxNetworkRetries:3
        })
        await connect()
        var shippingProduct = await Schema.Product().find({name:"Shipping"})
        var price = shippingProduct[0].price_standard
        const sesh = await getSession(ctx)
        const {Cart}= parseCookies(ctx,{
            path:"/"
        })
        console.log(Cart)
        console.log("1: " +(start-Date.now())/1000)
        let subscriptionCheckout = req.url.split('?subscription=').length>1
        let shippingCost = price as number
        let total;

        console.log("2: " +(start-Date.now())/1000)
        if(sesh&&sesh.user&&sesh.user.cart){
            total = sesh.user.cart.items.reduce((a:number,b:Product)=>{
                return a+b.price*b.quantity
            },0)

        }
        else if(Cart) {
            total = JSON.parse(Cart).items.reduce((a:number,b:Product)=>{
                return a+b.price*b.quantity
            },0)
        }
        console.log(total)
        if(!sesh&&!Cart){
            console.log('no cart?!')
            return {
                props:{
                    refresh:true
                },
                };
        }
        
        console.log("3: " +(start-Date.now())/1000)
        let paymentIntent;
        const {checkoutDetails} = parseCookies(ctx,{
            path:"/checkout"
        })
        if(checkoutDetails){

        console.log("4: " +(start-Date.now())/1000)
            var paymentIntentId=JSON.parse(checkoutDetails).paymentIntentId
            var subscriptionId=JSON.parse(checkoutDetails).subscriptionId

            paymentIntent=await stripe.paymentIntents.retrieve(paymentIntentId)
            if(
                paymentIntent.status==="canceled"||
                paymentIntent.status==="succeeded"||
                (subscriptionId===''&&subscriptionCheckout===true)||
                (subscriptionId!==''&&subscriptionCheckout===false)
                ){
                    console.log('cookie destroyer')
                    destroyCookie(ctx,"checkoutDetails")
                    if(subscriptionId!==''){
                        await stripe.subscriptions.del(
                            subscriptionId
                        )
                    }
            }
            else{
                console.log('else..')
                if(subscriptionId===''&&subscriptionCheckout===false){
                    
                    console.log('subid and subscriptioncheckout both false')
                    if(paymentIntent.amount!==((total*100)+shippingCost*100)){
                        paymentIntent=await stripe.paymentIntents.update(paymentIntentId,{
                            amount:total*100+shippingCost*100
                        })
                        console.log('update pi')
                    }
                        return {
                            props: {
                                paymentIntent:paymentIntent,
                                subscriptionId:''
                            }
                        }
                    
                }
                else if (subscriptionId!==''&&subscriptionCheckout==true) {
                    console.log("5: " +(start-Date.now())/1000)
                    console.log(total)
                    console.log(paymentIntent.amount)
                    if(paymentIntent.amount!==(total*100+shippingCost*100)){
                        destroyCookie(ctx,"checkoutDetails")
                        await stripe.subscriptions.del(
                            subscriptionId
                        )
                    }
                    else {
                        console.log('subid and subpage')
                        return {
                            props: {
                                paymentIntent:paymentIntent,
                                subscriptionId:subscriptionId
                            }
                        }
                    }

                }
                else {
                    console.log('weirdness')
                    return {
                        props:{
                            refresh:true
                        },
                    };
                }
            }
                
        }
            if(!subscriptionCheckout){
                const idempotencyKey = uuidv4();
                paymentIntent = await stripe.paymentIntents.create({
                    amount: total*100+shippingCost*100,
                    currency: 'gbp',
                    automatic_payment_methods: {
                        enabled: true,
                      },
                    
                },{
                    idempotencyKey:idempotencyKey
                })
                setCookie(ctx,'checkoutDetails',JSON.stringify({paymentIntentId:paymentIntent.id,subscriptionId:''}),{
                    path:'/checkout'
                })
                return {
                    props: {
                        paymentIntent:paymentIntent,
                        subscriptionId:''
                    }
                }
            }
            else{
                var props = await getPaymentIntentSubscription(sesh,stripe,Cart,shippingCost,subscriptionId,ctx,start)
                return props
        }
        
    }
    catch(e:any){
        console.log(e)
        return {
            props:{
                refresh:true
            },
          };
    }
    
}