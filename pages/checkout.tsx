
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements
  } from "@stripe/react-stripe-js";
import Stripe from "stripe";
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );
// import {useEffect,useContext} from 'react';
import {parseCookies, setCookie} from 'nookies'
import CheckoutForm from '../components/checkout-form'
import { getSession, getCsrfToken } from 'next-auth/react';
import { Product } from '../utils/types'
import { v4 as uuidv4 } from 'uuid';
import errorHandler from '../utils/errorHandler'

export default function Checkout({paymentIntent}:any){
    
    // const context = useContext(CartContext);
    // useEffect(()=>{

    // },[])
    const options = {
        clientSecret: paymentIntent.client_secret
    }
   
    
    return(

            <Elements stripe={stripePromise} options={options}>
                <CheckoutForm paymentIntent={paymentIntent}  />
            </Elements>
    )
}

export const getServerSideProps =  async(ctx:any) => {
    const {req,res} = ctx;
    try {
        const secret_key = process.env.STRIPE_SECRET_KEY as string;
        var stripe = new Stripe(secret_key,{
            apiVersion:"2022-08-01",
            maxNetworkRetries:3
        })
        const sesh = await getSession(ctx)
        const {Cart}= parseCookies(ctx)
        let total;
        if(sesh&&sesh.user&&sesh.user.cart){
            total = sesh.user.cart.items.reduce((a:number,b:Product)=>{
                return a+b.price
            },0)

        }
        else if(Cart) {
            console.log('CHECKOUT CARTTT',Cart)
            total = JSON.parse(Cart).items.reduce((a:number,b:Product)=>{
                return a+b.price
            },0)
        }

        if(!sesh&&!Cart){
            return {
                redirect: {
                  permanent: false,
                  destination: "/",
                },
                props:{},
              };
        }
        console.log('YO',total)
        let paymentIntent;
        const {paymentIntentId} = parseCookies(ctx)
        if(paymentIntentId){
            paymentIntent=await stripe.paymentIntents.retrieve(paymentIntentId)
            if(paymentIntent.amount!==total*100){
                
                paymentIntent=await stripe.paymentIntents.update(paymentIntentId,{
                    amount:total*100+500
                })
            }
            return {
                props: {
                    paymentIntent:paymentIntent
                }
            }
        }
        const idempotencyKey = uuidv4();
        paymentIntent = await stripe.paymentIntents.create({
            amount: total*100+500,
            currency: 'gbp',
            automatic_payment_methods: {
                enabled: true,
              },
            
        },{
            idempotencyKey:idempotencyKey
        })
        setCookie(ctx,'paymentIntentId',paymentIntent.id)
        return {
            props: {
                paymentIntent:paymentIntent,
            }
        }
    }
    catch(e:any){
        await errorHandler(JSON.stringify(req.headers),req.body?JSON.stringify(req.body):'no body',req.method, e.message,e.stack,false)
        console.log(e)
    }
    
}