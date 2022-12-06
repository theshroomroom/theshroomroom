import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/connection'
import {Product} from '../../utils/schema';
import errorHandler from '../../utils/errorHandler'
type Data = {
    name: string;
    description: string;
    price: number;
}

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  try{

    if(req.method!=='GET'){
      throw new Error('Only get requests for this route.');
    }
    console.log('pre connect')
    await connect()
    console.log('post connect')
    var response;
    console.log(req.url);
    if(RegExp('product=').test(req.url as string)===true){
      response = await Product().findOne({name:req.url?.split('product=')[1].replace('%27','\'').replace('%20',' ')})
    }
    else if(RegExp('type=').test(req.url as string)===true){
      response = await Product().find({"productType":req.url?.split('type=')[1]},{})
      console.log('RESSSSSSS',response)
    }
    else {
      response = await Product().find({})

    }
    
    if(!response){
      throw new Error('No products found.')
    }
    else {
      res.status(200).json(response)
    }

  }
  catch(e:any){
    await errorHandler(JSON.stringify(req.headers),JSON.stringify(req.body),req.method as string,e.error,e.stack,false)

    res.status(500).json({error:e.message})

  }
}