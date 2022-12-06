import {User,PasswordResetToken} from '../../utils/schema'
import connect from '../../utils/connection'
import type { NextApiRequest, NextApiResponse } from 'next';
import {getCsrfToken} from 'next-auth/react';
import errorHandler from '../../utils/errorHandler';
import {sendEmail} from '../../utils/nodemailer';
import {nanoid} from 'nanoid';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        
        if(req.method!=="POST"){
            throw new Error('Not post request.')
        }
        if(!req.headers.csrftoken){
            throw new Error('No csrf header found.')
        }
        const csrftoken = await getCsrfToken({req})
        if(req.headers.csrftoken!==csrftoken){
            throw new Error('CSRF authentication failed.')
        }
        await connect()
        const body = JSON.parse(req.body);
        const token = nanoid(32);
        const messageToClient=await User().findOne({username:body.username})
        if(messageToClient){
            const resetToken = new (PasswordResetToken() as any)({
                passwordResetToken:token,
                userId: messageToClient._id
            })
            console.log(resetToken)
            resetToken.save()
            await sendEmail({
                subject: "Password reset",
                html:`<p>Click the following link to reset your password</p>
                        <a href="https://${req.headers.host}/forgotten-password/${token}">LINK</a>`,
                to:"theshroomroomdev@gmail.com",
                from: "ServerSideError@theshroomroomdev.com"
            })
            res.status(200).json({message:"Password sent to email provided."})
        }
        else {
            res.status(400).json({error:"User does not exist."})
        }

    }
    catch(e:any){
        console.log(e)
        await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.error,e.stack,false)

        res.status(500).json({error:e.message})
    }
}