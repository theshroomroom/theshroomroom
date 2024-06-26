import {User} from '../../utils/schema';
import {ReceiveUpdates} from '../../utils/schema';
import connect from '../../utils/connection';
import type { NextApiRequest, NextApiResponse } from 'next';
import {getCsrfToken} from 'next-auth/react';
import {errorHandler} from '../../utils/emailHandlers';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    
    try{
        if(req.method!=="DELETE"){
            var e= new Error('Not delete request.')
            return res.status(500).json({success:false,error:e.toString()})
        }
        const csrftoken = await getCsrfToken({req:{headers:req.headers}})
        if(req.headers.csrftoken!==csrftoken){
            var e=new Error('CSRF authentication failed.')
            return res.status(500).json({success:false,error:e.toString()})
        }
        await connect()

        const body = JSON.parse(req.body);
        if(body.subscription){
                const existsSubscribe = await ReceiveUpdates().findOne({email:body.email})
                if(!existsSubscribe){
                    var error= new Error('This email is not in our subscription list. If you have an account, log in and unsubscribe under edit user in your account settings.')
                    return res.status(500).json({success:false,error:error.toString()})
                }
                var subscription = new (ReceiveUpdates() as any)(body);
                await subscription.save()
            
        }
        else{
            var e= new Error('This route is for unsubscribing')
            return res.status(500).json({success:false,error:e.toString()})


        }
        return res.status(200).json({message:"Subscription successfully deleted"})
        

    }
    catch(e:any){
        console.error(e)
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.toString(),false)
        return res.status(500).json({success:false,error:e.toString()})
        

    }
}