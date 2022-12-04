import { getSession } from "next-auth/react"
import { useEffect, useState,FormEvent,useContext } from "react"
import {
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js'
import {useRouter} from 'next/router'
import {getCsrfToken} from 'next-auth/react'
import {destroyCookie} from 'nookies'
import {CartContext} from '../context/cart';
export interface Product {
    _id: String,
    price: number,
    quantity: number,
    name: string
  }
interface UserSchema {
    id: string,
    name: String,
    username: any,
    email: String|undefined,
    password: string|undefined,
    cart: {
        items:Product[]
    },
    dAddress: {
        firstName: String,
        surname: String,
        firstLine: String,
        secondLine: String,
        city: String,
        postcode: String,
    },
    bAddress: {
        firstName: String,
        surname: String,
        firstLine: String,
        secondLine:String,
        city: String,
        postcode: String,
    },
    updates: Boolean,
}
export default function CheckoutForm(props:any){
    const context = useContext(CartContext);
    const [dFirstName,setDFirstName]=useState('');
    const [dFirstNameVal,setDFirstNameVal]=useState<boolean|null>(null);
    const [dSurname,setDSurname]=useState('');
    const [dSurnameVal,setDSurnameVal]=useState<boolean|null>(null);
    const [dFirstLine,setDFirstLine]=useState('');
    const [dFirstLineVal,setDFirstLineVal]=useState<boolean|null>(null);
    const [dSecondLine,setDSecondLine]=useState('');
    const [dCity,setDCity]=useState('');
    const [dCityVal,setDCityVal]=useState<boolean|null>(null);
    const [dPostcode,setDPostcode]=useState('');
    const [dPostcodeVal,setDPostcodeVal]=useState<boolean|null>(null);
    const [bFirstName,setBFirstName]=useState('');
    const [bFirstNameVal,setBFirstNameVal]=useState<boolean|null>(null);
    const [bSurname,setBSurname]=useState('');
    const [bSurnameVal,setBSurnameVal]=useState<boolean|null>(null);
    const [bFirstLine,setBFirstLine]=useState('');
    const [bFirstLineVal,setBFirstLineVal]=useState<boolean|null>(null);
    const [bSecondLine,setBSecondLine]=useState('');
    const [bCity,setBCity]=useState('');
    const [bCityVal,setBCityVal]=useState<boolean|null>(null);
    const [bPostcode,setBPostcode]=useState('');
    const [bPostcodeVal,setBPostcodeVal]=useState<boolean|null>(null);
    const [guestEmailAddress,setGuestEmailAddress]=useState('');
    const [guestEmailAddressVal,setGuestEmailAddressVal]=useState<boolean|null>(null)
    const [updates,setUpdates]=useState(false);
    const [user,setUser]=useState<UserSchema|null>(null);
    const [checkoutError, setCheckoutError]=useState('');
    const [checkoutSuccess,setCheckoutSuccess] = useState('');
    const [cardDetailsValid,setCardDetailsValid]=useState<boolean|null>(null);
    const [processing,setProcessing] = useState(false)
    const [errorMessage,setErrorMessage] = useState('');
    const stripe = useStripe();
    const elements:any=useElements();
    useEffect(()=>{
        const initiate = async()=>{
            console.log(Object.getOwnPropertyNames(PaymentElement))
            const session = await getSession()
            if(session?.user){
                setUser(session.user as any)
            }
            if(session){
                fetch(`http://localhost:3000/api/getUser/${session.user.email}`)
                .then((res)=>{
                    console.log('ehhhhhh')
                    return res.json()
                })
                .then((res)=>{
                    if(res.error){
                        throw new Error('Unable to load user details')
                    }
                    if(res.user.dAddress.firstName&&res.user.dAddress.firstName.length>0){
                        setDFirstName(res.user.dAddress.firstName);
                    }
                    if(res.user.dAddress?.surname&&res.user.dAddress?.surname>0){
                        setDSurname(res.user.dAddress.surname);
                    }
                    if(res.user.dAddress.firstLine&&res.user.dAddress.firstLine.length>0){
                        setDFirstLine(res.user.dAddress.firstLine);
                    }
                    if(res.user.dAddress.secondLine){
                        setDSecondLine(res.user.dAddress.secondLine);
                    }
                    if(res.user.dAddress.city&&res.user.dAddress.city.length>0){
                        setDCity(res.user.dAddress.city);
                    }
                    if(res.user.dAddress.postcode&&res.user.dAddress.postcode.length>0){
                        setDPostcode(res.user.dAddress.postcode);
                    }
                    if(res.user.bAddress.firstName&&res.user.bAddress.firstName>0){
                        setBFirstName(res.user.bAddress.firstName);
                    }
                    if(res.user.bAddress.surname&&res.user.bAddress.surname>0){
                        setBSurname(res.user.bAddress.surname);
                    }
                    if(res.user.bAddress.firstLine&&res.user.bAddress.firstLine.length>0){
                        setBFirstLine(res.user.bAddress.firstLine);
                    }
                    if(res.user.bAddress.secondLine){
                        setBSecondLine(res.user.bAddress.secondLine);

                    }
                    if(res.user.bAddress.city&&res.user.bAddress.city.length>0){
                        setBCity(res.user.bAddress.city);

                    }
                    if(res.user.bAddress.postcode&&res.user.bAddress.postcode>0){
                        setBPostcode(res.user.bAddress.postcode);
                    }
                        setUpdates(res.user.updates)
                })
                .catch((e)=>{
                    setErrorMessage('Unable to load user details.')
                    setTimeout(function(){
                        setErrorMessage('');
                    },2000)
                })
            }
            
            
        }
        initiate()
    }
    
,[])
    const paymentElementHandler=(e:any)=>{
        if(e.complete){
            console.log('incomplete')
            setCardDetailsValid(true)
        }
        else {
            setCardDetailsValid(false)
            console.log('complete')
        }

    }
    const validate_form=()=>{
        if(dFirstNameVal&&dSurnameVal&&dFirstLineVal&&dCityVal&&dPostcodeVal&&bFirstNameVal&&bSurnameVal&&bFirstLineVal&&bCityVal&&bPostcodeVal&&cardDetailsValid){
            if(guestEmailAddressVal||user){
                console.log('yo')
                return true
            }
            else {
                console.log('no')
                setCheckoutError('Please either sign in or provide a valid email for guest checkout')
                setFormPosition()
                return false
            }
        }
        else {
            console.log('fook')
            setCheckoutError('Please fill in all required fields')
            setFormPosition()
            return false
        }
        
    }
    const setFormPosition=()=>{
        const first_error = document.querySelector('.error-text, .Error')
        if(first_error){
            var rect = first_error.getBoundingClientRect()
            const x = rect.left +first_error.clientWidth
            const y = rect.top + first_error.clientHeight
            window.scrollTo(x,y)

        }
    }
    const placeOrder=async(e:FormEvent)=>{
        e.preventDefault()
        try {
            setProcessing(true)
            const valid = validate_form()
            console.log(valid)
            if(!valid){
                throw new Error('Please enter form details correctly')
            }
            var emailAddress;
            var userId=null;
            if(guestEmailAddress){
                var guestCheckout=true;
                emailAddress=guestEmailAddress;
            }
            else {
                var guestCheckout=false;
                emailAddress=user?.email
                userId=user?.id
            }
            const eventInitiated = await fetch('/api/order',{
                method: "POST",
                headers: {
                    "csrfToken": await getCsrfToken() as string
                },
                body: JSON.stringify({
                    userId: userId,
                    email:emailAddress,
                    guestCheckout: guestCheckout,
                    dAddress: {
                        firstName: dFirstName,
                        surname: dSurname,
                        firstLine: dFirstLine,
                        secondLine: dSecondLine,
                        city: dCity,
                        postcode: dPostcode,
                    },
                    bAddress: {
                        firstName: bFirstName,
                        surname: bSurname,
                        firstLine: bFirstLine,
                        secondLine: bSecondLine,
                        city: bCity,
                        postcode: bPostcode,
                    },
                    products: context.state.cart,
                    shippingCost: context.state.shipping,
                    shippingMethod:context.state.shippingMethod,
                    subtotal:context.state.subTotal,
                    total:context.state.total,
                    status:"INITIATED",
                    error: 'None',
                    paymentIntentId:props.paymentIntent.id
                })
            })
            const reachedDatabase = await eventInitiated.json()
            if(reachedDatabase.success===false){
                throw new Error("Order failed, no order received")
            }
            const {error, paymentIntent: {status}}:any=await stripe?.confirmPayment({
                elements,
                confirmParams:{
                    return_url:`${window.location.origin}/api/stripe_webhook`
                },
                redirect:"if_required"
            })
            if(error){
                await fetch('/api/order',{
                    method: "PUT",
                    headers: {
                        csrftoken: await getCsrfToken() as string
                    },
                    body: JSON.stringify({
                        paymentIntentId:props.paymentIntent.id,
                        status:'ORDER_FAILED_STRIPE',
                        error: error
                    })
                })
                throw new Error('Order failed stripe issue')
            }
            if( status==='succeeded'){
                destroyCookie(null, "paymentIntentId")
                destroyCookie(null,  "Cart")
                await fetch('/api/order',{
                    method: "PUT",
                    headers: {
                        csrftoken:await getCsrfToken() as string
                    },
                    body: JSON.stringify({
                        paymentIntentId:props.paymentIntent.id,
                        status:'ORDER_PENDING'
                    })
                })
                if(context&&context.dispatch){
                    context.dispatch({
                        type:"UPDATE_CART",
                        payload:{
                            items:[]
                        }
                        })
                    setCheckoutSuccess('Payment Made')

                }
            }
        }
        catch(e:any){
            console.log('yoyoyoy')
            console.log(e)
            setProcessing(false)
            setCheckoutError(e.message)
        }

    }
    if (checkoutSuccess) return <p>{checkoutSuccess}</p>
    return (
        <>
        <h1>CHECK ME OUT</h1>
        {
            errorMessage!==''?
            <p>{errorMessage}</p>:
            null
        }
            <form action="POST" onSubmit={(e)=>placeOrder(e)} autoComplete="fuck-off">
                <input autoComplete="new-password" name="hidden" type="text" style={{"display":"none"}}/>
                {context.loaded&&user===null&&
                <>
                <h2>Guest Checkout</h2>
                <label htmlFor="guestEmailAddress">Email Address</label>
                <input autoComplete="fuck-off" type="email" required={!user} id="guestEmailAddress" value={guestEmailAddress} 
                    onBlur={(e)=>{
                        if(e.target.checkValidity()){
                            setGuestEmailAddressVal(true)
                        }
                        else {
                            setGuestEmailAddressVal(false)
                        }

                    }}
                    onChange={(e)=>{
                        setGuestEmailAddress(e.target.value)
                        if(typeof guestEmailAddressVal==="boolean"){
                            if(e.target.checkValidity()){
                                setGuestEmailAddressVal(true)
                            }
                            else {
                                setGuestEmailAddressVal(false)
                            }

                        }
                    }
                    }/>
                {
                    guestEmailAddressVal===false?
                    <p className={"error-text"}>Please enter an email or sign in</p>
                    :
                    null

                }
                </>

            }
                <h2>Delivery Address</h2>
                <label htmlFor="dFirstName">First Name</label>
                <input  autoComplete="fuck-off" required id="dFirstName" value={dFirstName} 
                    onBlur={(e)=>{
                        if(e.target.value.length>0){
                            setDFirstNameVal(true)
                        }
                        else {
                            setDFirstNameVal(false)
                        }
                        
                    }}
                    onChange={(e)=>{
                        setDFirstName(e.target.value)
                        if(typeof dFirstNameVal==="boolean"){
                            if(e.target.value.length>0){
                                setDFirstNameVal(true)
                            }
                            else {
                                setDFirstNameVal(false)
                            }
                        }
                    }
                }/>
                {
                    dFirstNameVal===false?
                    <p className={'error-text'}>Please enter a valid name</p>
                    :null
                }
                <label htmlFor="dSurname">Surname</label>
                <input autoComplete="fuck-off" required id="dSurname" value={dSurname} 
                    onBlur={(e)=>{
                        if(e.target.value.length>0){
                            setDSurnameVal(true)
                        }
                        else {
                            setDSurnameVal(false)
                        }
                        
                    }}
                    
                    onChange={(e)=>{
                        setDSurname(e.target.value)
                        if(typeof dSurnameVal === "boolean"){
                            if(e.target.value.length>0){
                                setDSurnameVal(true)
                            }
                            else {
                                setDSurnameVal(false)
                            }

                        }
                    }
                }/>
                {
                    dSurnameVal===false?
                    <p className={'error-text'}>Please enter a valid surname</p>
                    :null
                }
                <label htmlFor="dFirstLine">Street name and number</label>
                <input autoComplete="fuck-off" required id="dFirstLine1" value={dFirstLine}
                    onBlur={(e)=>{
                        if(e.target.value.length>0){
                            setDFirstLineVal(true)
                        }
                        else {
                            setDFirstLineVal(false)
                        }
                        
                    }} 
                
                    onChange={(e)=>{
                        setDFirstLine(e.target.value)
                        if(typeof dFirstLineVal==="boolean"){
                            if(e.target.value.length>0){
                                setDFirstLineVal(true)
                            }
                            else {
                                setDFirstLineVal(false)
                            }

                        }
                    }
                }/>
                {
                    dFirstLineVal===false?
                    <p className={'error-text'}>Please enter a valid name</p>
                    :null

                }
                <label htmlFor="dSecondLine">2nd Line of address</label>
                <input autoComplete="fuck-off" id="dSecondLine" value={dSecondLine} onChange={(e)=>setDSecondLine(e.target.value)}/>
                <label htmlFor="dCity">City</label>
                <input autoComplete="fuck-off" id="dCity" value={dCity} 
                
                    onBlur={(e)=>{
                        if(e.target.value.length>0){
                            setDCityVal(true)
                        }
                        else {
                            setDCityVal(false)
                        }
                            
                    }}
                    onChange={(e)=>{
                        setDCity(e.target.value)
                        if(typeof dCityVal==="boolean"){
                            if(e.target.value.length>0){
                                setDCityVal(true)
                            }
                            else {
                                setDCityVal(false)
                            }

                        }
                    }
                }/>
                {
                    dCityVal===false?
                    <p className={'error-text'}>Please enter a valid name</p>
                    :null

                }
                <label htmlFor="dPostcode">Postcode</label>
                <input autoComplete="fuck-off" required id="dPostcode" value={dPostcode} 
                
                    onBlur={(e)=>{
                        console.log(e.target.value.length)
                        if(e.target.value.length>0){
                            setDPostcodeVal(true)
                        }
                        else {
                            setDPostcodeVal(false)
                        }
                            
                    }}
                    onChange={(e)=>{
                        setDPostcode(e.target.value)
                        if(typeof dPostcodeVal === 'boolean'){
                            if(e.target.value.length>0){
                                setDPostcodeVal(true)
                            }
                            else {
                                setDPostcodeVal(false)
                            }

                        }
                    }
                }/>
                {
                    dPostcodeVal===false?
                    <p className={'error-text'}>Please enter a valid name</p>
                    :null

                }
                <label htmlFor="updates">Receive updates</label>
                <h2>Billing Address</h2>
                <label htmlFor="bFirstName">First Name</label>
                <input autoComplete="fuck-off" required id="bFirstName" value={bFirstName} 

                onBlur={(e)=>{
                    if(e.target.value.length>0){
                        setBFirstNameVal(true)
                    }
                    else {
                        setBFirstNameVal(false)
                    }
                }}
                
                onChange={(e)=>{
                    setBFirstName(e.target.value)
                    if(typeof bFirstName==="boolean"){
                        if(e.target.value.length>0){
                            setBFirstNameVal(true)
                        }
                        else {
                            setBFirstNameVal(false)
                        }

                    }
                }}/>
                {
                    bFirstNameVal===false?
                    <p className={'error-text'}>Please enter a valid name</p>
                    :null
                }
                <label htmlFor="bSurname">Surname</label>
                <input autoComplete="fuck-off" required id="bSurname" value={bSurname} 
                
                    onBlur={(e)=>{
                        if(e.target.value.length>0){
                            setBSurnameVal(true)
                        }
                        else {
                            setBSurnameVal(false)
                        }
                            
                    }}
                    onChange={(e)=>{
                        setBSurname(e.target.value)
                        if(typeof bSurnameVal==='boolean'){
                            if(e.target.value.length>0){
                                setBSurnameVal(true)
                            }
                            else {
                                setBSurnameVal(false)
                            }

                        }
                    }}
                />
                {
                    bSurnameVal===false?
                    <p className={'error-text'}>Please enter a valid surname</p>
                    :null

                }
                <label htmlFor="bFirstLine">Street name and number</label>
                <input autoComplete="fuck-off" required id="bFirstLine1" value={bFirstLine} 
                
                    onBlur={(e)=>{
                        if(e.target.value.length>0){
                            setBFirstLineVal(true)
                        }
                        else {
                            setBFirstLineVal(false)
                        }
                            
                    }}
                    onChange={(e)=>{
                        setBFirstLine(e.target.value)
                        if(typeof bFirstLineVal==='boolean'){
                            if(e.target.value.length>0){
                                setBFirstLineVal(true)
                            }
                            else {
                                setBFirstLineVal(false)
                            }

                        }
                    }}
                />
                {
                    bFirstLineVal===false?
                    <p className={'error-text'}>Please enter a valid name</p>
                    :null

                }
                <label htmlFor="bSecondLine">2nd Line of address</label>
                <input autoComplete="fuck-off" id="bSecondLine" value={bSecondLine} onChange={(e)=>setBSecondLine(e.target.value)}/>
                <label htmlFor="bCity">City</label>
                <input autoComplete="fuck-off" id="bCity" value={bCity} 
                
                    onBlur={(e)=>{
                        if(e.target.value.length>0){
                            setBCityVal(true)
                        }
                        else {
                            setBCityVal(false)
                        }
                            
                    }}
                    onChange={(e)=>{
                        setBCity(e.target.value)
                        if(typeof bCityVal==='boolean'){
                            if(e.target.value.length>0){
                                setBCityVal(true)
                            }
                            else {
                                setBCityVal(false)
                            }

                        }
                    }}
                />
                {
                    bCityVal===false?
                    <p className={'error-text'}>Please enter a valid name</p>
                    :null

                }
                <label htmlFor="bPostcode">Postcode</label>
                <input autoComplete="fuck-off" required id="bPostcode" value={bPostcode} 
                    onBlur={(e)=>{
                        if(e.target.value.length>0){
                            setBPostcodeVal(true)
                        }
                        else {
                            setBPostcodeVal(false)
                        }
                    }}
                    onChange={(e)=>{
                        setBPostcode(e.target.value)
                        if(typeof bPostcodeVal==='boolean'){
                            if(e.target.value.length>0){
                                setBPostcodeVal(true)
                            }
                            else {
                                setBPostcodeVal(false)
                            }

                        }
                    }}
                />
                {
                    bPostcodeVal===false?
                    <p className={'error-text'}>Please enter a valid name</p>
                    :null

                }
                <PaymentElement onChange={(e)=>paymentElementHandler(e)}/>

                <label htmlFor="updates">Receive updates</label>
                <input autoComplete="fuck-off" id="updates" type="checkbox" value={String(updates)} onChange={(e)=>setUpdates(e.target.checked)}/>
                {
                    context.loaded&&
                        <div>
                            <p>Subtotal: <>{context.state.subTotal}</></p>
                            <p>Shipping: <>{context.state.shipping}</></p>
                            <p>Total: <>{context.state.total}</></p>

                        </div>
                }
                <button id="placeOrder" type="submit" disabled={processing} onClick={(e)=>placeOrder(e)}>Submit</button>
            </form>
            {checkoutError&& <p className="form-error"style={{color:"red"}}>{checkoutError}</p>}
            </>
    )
}