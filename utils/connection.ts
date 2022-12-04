import mongoose, { Model } from "mongoose"

// CONNECTING TO MONGOOSE (Get Database Url from .env.local)
const { MONGODB_URI } = process.env

// connection function
export default async function connect() {
  if(process.env.NODE_ENV!=='test'){
    const conn = await mongoose
      .connect(MONGODB_URI as string)
      .catch(err => console.log(err))
    return conn

  }
}