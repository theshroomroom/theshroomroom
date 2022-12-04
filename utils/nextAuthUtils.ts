import bcrypt from 'bcrypt';
export default async(userpassword:string,password:string):Promise<Boolean>=> {
    try{
        if(!password){
            throw new Error("Please enter password")
        }
        if(!userpassword){
            throw new Error("No userpassword")
        }
        const isMatch = await bcrypt.compare(password,userpassword)
        if(!isMatch){
            throw new Error("Password incorrect")
        }
        return true

    }
    catch(e:any){
        console.log(e)
        return false
    }
}