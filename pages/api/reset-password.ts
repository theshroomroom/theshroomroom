import {User,PasswordResetToken} from '../../utils/schema'
import connect from '../../utils/connection'
import type { NextApiRequest, NextApiResponse } from 'next';
import {getCsrfToken} from 'next-auth/react';
import {errorHandler} from '../../utils/emailHandlers';
import {sendEmail} from '../../utils/nodemailer';
import {nanoid} from 'nanoid';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        
        if(req.method!=="POST"){
            var e= new Error('Not post request.')
            return res.status(500).json({success:false,error:e.toString()})
        }
        if(!req.headers.csrftoken){
            var e= new Error('No csrf header found.')
            return res.status(500).json({success:false,error:e.toString()})
        }
        const csrftoken = await getCsrfToken({req:{headers:req.headers}})
        if(req.headers.csrftoken!==csrftoken){
            var e= new Error('CSRF authentication failed.')
            return res.status(500).json({success:false,error:e.toString()})
        }
        await connect()
        const body = JSON.parse(req.body);
        const token = nanoid(32);
        const messageToClient=await User().findOne({username:body.username})
        const website = process.env.WEBSITE_NAME
        if(messageToClient){
            const resetToken = new (PasswordResetToken() as any)({
                passwordResetToken:token,
                userId: messageToClient._id
            })
            await resetToken.save()
            await sendEmail({
                subject: "Password reset",
                html:`<p>Click the following link to reset your password</p>
                        <a href="${website}/forgotten-password/${token}">LINK</a>`,
                to:`${body.username}`,
                from: "ServerSideError@theshroomroomdev.com"
            })
            res.status(200).json({message:"Password sent to email provided."})
        }
        else {
            res.status(400).json({error:"User does not exist."})
        }

    }
    catch(e:any){
        
        console.error(e)
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.toString(),false)
        return res.status(500).json({success:false,error:e.toString()})
    }
}