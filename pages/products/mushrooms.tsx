import Link from 'next/link'
import Image from 'next/image'
import {useEffect, useState, FormEvent,useContext} from 'react';
import {CartContext} from '../../context/cart';
import {imageMap} from '../../utils/imageMap/imageMap'

interface ProductInterface{
    name:String;
    description: String;
    price: Number;
    quantity: Number;
    
}
export default function Product(props:{mushrooms:ProductInterface[]}){
    const [products,setProducts]=useState<ProductInterface[]>([])
    useEffect(()=>{
        setProducts(props.mushrooms)

    },[])
    const context=useContext(CartContext)
    return(
        <>
        <h1>Mushrooms</h1>
        <p>Fresh and dried mushrooms</p>
        {
            products&&products.length>0?
        <ul>
        {
            products.length>0?products.map(({_id,name,description,price}:any,idx)=>{
                return(
                    <div className="product" key={name}>
                        <Link  href={`/products/${name.replace(/[\s]/gi,'-').replace(/['\'']/gi,'&apos')}`} >
                            <a>
                                <h2 className="product-name">{name}</h2>

                                {
                                    name?

                                    <Image className="product-image"  width={imageMap[name].width} height={imageMap[name].height} src={`${imageMap[name].path}.${imageMap[name].fileType}`} alt={name}/>
                                    :
                                    null
                                }

                            </a>
                        </Link>
                            <p className="product-price">£{price}</p>
                            <p className="product-description">{description}</p>
                        <select className="product-quantity"id={`quantity${idx}`}name={"quantity"}>
                            {
                                [1,2,3,4,5,6,7,8,9,10].map((el:Number)=>{
                                    return (
                                        <option className="product-quantity-options" key={String(el)} value={String(el)}>{String(el)}</option>
                                    )
                                })
                            }

                        </select>
                        
                        <button onClick={async(e)=>{
                            const input = document.getElementById(`quantity${idx}`) as HTMLInputElement;
                            context.saveCart? context.saveCart({
                                _id:_id,
                                name:name,
                                quantity:Number(input.value),
                                price: Number(price)
                            }):null}
                        }
                        className="product-add-to-cart-button"
                        >Add to basket</button>

                    </div>
                )
            }):null
        }

        </ul>:
        <p id="noProducts">No products available.</p>
}
        </>
    )
}
export async function getServerSideProps(){
    const data= await fetch(`http://localhost:3000/api/products?type=mushrooms`)
    const res = await data.json()
   
    return {
        props:{
            mushrooms:[...res]
        }
    }
}