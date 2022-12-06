import {NextApiRequest,NextApiResponse} from 'next'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    
});
import {buffer } from '../../utils/stripe_webhook'
import connect from "../../utils/connection" 
import errorHandler from '../../utils/errorHandler'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        await connect()
        console.log('ERRRRRRR WEBHOOK') 
        console.log(req.headers.host)
        if(req.method==="POST"){
            if(!req.headers["stripe-signature"]){
                throw new Error('No stripe signature')
            }
            console.log('YOYOYO BITCH WEBHOOK WORKS YOOOOO')
            var rawBody =  await buffer(req);
            console.log(rawBody)
            const payload = rawBody.toString('utf8');
            console.log(payload)
            var signature= req.headers['stripe-signature']
            // const split_sigs=signatures.map((el:string)=>{
            //     return el.split('=')
            // })
            // const signed_payload=split_sigs[0][1]+'.'+payload;
            // var hash = sha256.create();
            // hash.update(signed_payload);
            // hash.hex();

            // var secret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET
            const event = stripe.webhooks.constructEvent(payload,signature,endpointSecret)
            // console.log(event)
            // console.log(event.type)
            var success;
            console.log(event.type)
            switch (event.type){
                case "payment_intent.succeeded":
                    console.log('PAYMENT INTENT SUCCEEEDED')
                    console.log(payload)
                    console.log(JSON.parse(payload))
                    const update_success= await fetch(`http://${req.headers.host}/api/order`,{
                        method:"PUT",
                        body: JSON.stringify({
                            paymentIntentId: JSON.parse(payload).data.object.id,
                            status:"ORDER_RECEIVED"
                        })
                    })
                    console.log('PAYMENT INTENT SUCCEEDEDEDDD ??')
                    const json_resp = await update_success.json()
                    success=json_resp.success
                    console.log(success)
                break;
                case "payment_intent.failed":
                    const update_failure= await fetch(`http://${req.headers.host}/api/order`,{
                        method:"PUT",
                        body: JSON.stringify({
                            paymentIntentId: JSON.parse(payload).data.object.id,
                            status:"ORDER_FAILED"
                        })
                    })
                    const json_resp_fail = await update_failure.json()
                    success=json_resp_fail.success
                    console.log('PAYMENT INTENT FAILED')
                break;
                
                case "payment_intent.canceled":
                    const update_cancel= await fetch(`http://${req.headers.host}/api/order`,{
                        method:"PUT",
                        body: JSON.stringify({
                            paymentIntentId: JSON.parse(payload).data.object.id,
                            status:"ORDER_CANCELLED"
                        })
                    })
                    const json_resp_cancel = await update_cancel.json()
                    success=json_resp_cancel.success
                    console.log('PAYMENT INTENT CANCELLED')
                break;
                default:
                    console.log('PAYMENT INTENT FUCK KNOWS')
                    success=true

            
                

            }

            if(success===true){
                res.status(200).end()
            }
            else {
                throw new Error(`Payment update failed: ${event.type}`)
            }
        }
        else {
            throw new Error('Only post requests should be sent to this route.')
        }

    }
    catch(e:any){
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.error,e.stack,false)

        res.status(500).json({success:false,error:e.message})
    }
}

export const config = {
    api: {
      bodyParser: false,
    },
  }