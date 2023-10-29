import {useEffect,useState,useContext} from 'react';
import Image from 'next/image';
import {imageMap} from '../../../utils/imageMap/imageMap';
import {CartContext} from '../../../context/cart';
import Head from 'next/head';
import {Metadata} from '../../../utils/metadata/metadata';

interface Product {
    _id:string,
    name:string,
    description:string,
    stripe_id:string,
    productType:string,
    price_dry_10g:number,
    price_dry_25g:number,
    price_dry_50g:number,
    price_dry_100g:number,
    price_fresh_100g:number,
    price_fresh_250g:number,
    price_fresh_500g:number,
    price_fresh_1kg:number}
export default function ProductDetails(){
    const context = useContext(CartContext);
    const [product,setProduct]=useState<Product>({
        _id:'',
        name:'',
        description:'',
        stripe_id:'',
        productType:'',
        price_dry_10g:0,
        price_dry_25g:0,
        price_dry_50g:0,
        price_dry_100g:0,
        price_fresh_100g:0,
        price_fresh_250g:0,
        price_fresh_500g:0,
        price_fresh_1kg:0,

    })
    const [name,setName]=useState('');
    const [description,setDescription]=useState('');
    const [imageUrl,setImageUrl]=useState('');
    const [type,setType]=useState('');
    const [price,setPrice]=useState('');
    const [id,setId]=useState('');
    const [fresh,setFresh]=useState(true);
    const [size,setSize]=useState('')
    const [qty,setQty]=useState(1);

    useEffect(()=>{
        const urlArr =window.location.href.split('/')
        const productName = urlArr[urlArr.length-1].replace(/[\-]/gi,' ').replace('\&apos','\'');
        setImageUrl(urlArr[urlArr.length-1].replace(/[\-]/gi,'_').replace('\&apos','').toLowerCase());
        const initiate = async()=>{
            const productDetailsJson = await fetch(`/api/products?product=${productName}`)
            const productDetails = await productDetailsJson.json()
            setProduct(productDetails)
            setName(productDetails.name);
            setDescription(productDetails.description);
            setType(productDetails.type)
            setId(productDetails._id)


        }
        initiate()


    },[])
    function toggleBackground(button:HTMLElement | null,targetClass:string){
        const buttons= document.querySelectorAll('.'+targetClass);
        buttons.forEach((el)=>el.classList.remove('select-active'));
        buttons.forEach((el)=>el.ariaSelected="false");
        if(button){
            button.classList.add("select-active")
            button.ariaSelected="true"
        }
    }
    return(
        <div className="product-container">
        <Head>
            <title>{Metadata["pdp"]["title"]}</title>
            <meta name="description" content={Metadata["pdp"]["description"]}/>
            <meta property="og:title" content={Metadata["pdp"]["title"]}/>
            <meta property="og:description" content={Metadata["pdp"]["description"]}/>
        </Head>
            <section className="image-section">
                {
                    name?

                    <Image id="productImage" fill src={`${imageMap[name].path}.${imageMap[name].fileType}`} alt={name} sizes="(min-width:1025px) 40vw, (max-width:767px) 80vw"priority placeholder="blur" blurDataURL={`${imageMap[name].path}.${imageMap[name].fileType}`} />
                    :
                    null
                }

            </section>
            <section className="text-section">
                <h1 className="main-heading product-heading" id="productName">{name?name:null} </h1>
                <p id="productDescription">{description?description:null} Learn more about <a className="link"href="/whatwegrow">{name}</a>.</p>
                <div role="listbox" aria-label="select fresh or dry">
                <button role="option"className="select-custom fresh-dry select-active" aria-selected={true}onClick={(e)=>{
                    setFresh(true);
                    setPrice('');
                    setSize('');
                    toggleBackground(e.target as HTMLElement,"fresh-dry")
                    toggleBackground(null,"size-select")
                }}>Fresh</button>
                <button role="option" className="select-custom fresh-dry" aria-selected={false} onClick={(e)=>{
                    setFresh(false)
                    setPrice('');
                    setSize('');
                    toggleBackground(e.target as HTMLElement,"fresh-dry")
                    toggleBackground(null,"size-select")
                    }}>Dry</button>
                </div>
                
                

                <p id="sizeLabel">Select a size:</p>
                <div role="listbox" aria-labelledby="sizeLabel">
                    {
                        fresh?["100g","250g","500g","1kg"].map((el:string)=>{
                            return(
                                <button key={el} className="select-custom size-select" role="option" aria-selected={false}
                                onClick={(e)=>{
                                    var text=(e.target as HTMLInputElement).textContent as string;
                                    if(fresh){
                
                                        var index="price_fresh_"+text
                                    }
                                    else {
                                        var index="price_dry_"+text
                                    }
                                    var productPrice = product[index as keyof Product]
                                    setPrice(productPrice.toString())
                                    setSize(text)
                                    toggleBackground(e.target as HTMLElement,"size-select")

                                }}>{el}</button>
                            )
                        })
                        :
                        ["10g","25g","50g","100g"].map((el:string)=>{
                            return(
                                <button key={el} className="select-custom size-select" role="option"aria-selected={false}
                                onClick={(e)=>{
                                    var text=(e.target as HTMLInputElement).textContent as string;
                                    if(fresh){
                                        var index="price_fresh_"+text
                                    }
                                    else {

                                        var index="price_dry_"+text
                
                                    }
                                    var productPrice = product[index as keyof Product]
                                    setPrice(productPrice.toString())
                                    setSize(text)
                                    toggleBackground(e.target as HTMLElement,"size-select")

                                }}>{el}</button>
                            )
                        })
                    }
                </div>
                <p id="productPrice"> Price: £{price?qty*Number(price):null}</p>
                <div>
                    <label htmlFor={"productQuantity"}>Qty: </label>
                    <input id={`productQuantity`} className="form-input"name={"quantity"} type="number" value={qty} onChange={(e)=>setQty(Number(e.target.value))}/>
                                 
                </div>
                
                <button id="productAddToCart" className="cta"onClick={async(e)=>{
                    try{
                        const input = document.getElementById(`productQuantity`) as HTMLInputElement;
                        if(size!==''&&input.value!==''){
                            context.saveCart? context.saveCart({
                                _id:id,
                                name:name,
                                fresh:fresh,
                                size:size,
                                quantity:Number(input.value),
                                price: Number(price),
        
                            }):null}
                        }
                    
                    catch(e){

                    }
                }
                    
                }>Add to basket</button>
            </section>
            

        </div>

    )
}
export async function getServerSideProps(ctx:any){
    return {
        props:{}
    }
}