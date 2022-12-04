import Link from 'next/link'
import {signIn, signOut,useSession,getSession} from "next-auth/react";
import {useContext,useState,useEffect} from 'react';
import {CartContext} from '../context/cart'
import styles from '../styles/Components/Header.module.css'
export default function Header(){
    const {data:session,status} = useSession()
    const [mobileMenuOpen,setMobileMenuOpen]=useState(false);
    const context = useContext(CartContext)
    function menuOpen(){
            if(document.body.classList.contains("fixed-mobile")){
                document.body.classList.remove("fixed-mobile")
            }
            else {
                document.body.classList.add("fixed-mobile")

            }

            setMobileMenuOpen(!mobileMenuOpen);
    }
    function toggleDisplay(target:Element){
        if(target&&target.nextElementSibling&&target.nextElementSibling.classList.contains('hidden-mobile')){
            target.nextElementSibling.classList.remove("hidden-mobile")
        }
        else if(target&&target.nextElementSibling) {

            target.nextElementSibling.classList.add("hidden-mobile")
        }
    }
    return (
        <header id="header" className={styles.header}>
            <div id="burgerMenu"
                onClick={(e)=>{
                    menuOpen()
                }}
                className={styles["burger-menu-container"]}>
                <span className={styles["burger-menu-element"]}></span>
            </div>
            <nav className={styles["nav"]}>
                <div className={styles["title-bar"]}>
                    <div className={styles["title-bar-element"]}>
                        {
                            (!session&& status!=="loading")?
                            <>
                                <a id="signIn"className={styles["toolbar-element"]} onClick={e=>signIn()} >Sign In</a>
                                <Link href="/auth/signup" passHref replace><a className={styles["toolbar-element"]}>Sign Up</a></Link>
                            </>
                            :
                            <>
                            <Link href="/api/auth/signout" passHref replace><a id="signOut"className={styles["toolbar-element"]} onClick={e=>{
                                e.preventDefault()
                                signOut()
                            }}>Sign Out</a></Link>
                            <Link id="myAccount"href="/myaccount" passHref replace><a className={styles["toolbar-element"]}>My Account</a></Link>
                            </>
                        }
                        <Link href="/cart" passHref replace><a id="cart" className={styles["toolbar-element"]}>{`You have ${context.state.totalQuantity} item${context.state.totalQuantity===1?'' :'s'} in your basket.`}</a></Link>
                    </div>
                    <div className={styles["title-bar-element"]}>
                        <Link href='/'><h1 className={styles.title}>The Shroom Room</h1></Link>

                    </div>
                    
                    <div className={styles["title-bar-element"]}>
                    {
                        session?
                            <p id="welcomeMessage">Hi {session.user?session.user.name:null}</p>

                        :
                        null
                    }

                    </div>
                </div>
                <ul className={`${styles["nav-list"]} ${mobileMenuOpen?"":styles["mobile-menu-visibility"]}`}>
                    
                    <li className={styles["nav-element"]+" "+ styles["hello"] +" hidden-desktop"}>Hello{session?` ${session.user.name}`:null}</li>
                    <li className={styles["nav-element"]}>
                        <span className={styles["nav-heading"]} onClick={(e)=>{
                            const target = e.target as Element;
                            toggleDisplay(target)}}>Products</span>
                        <ul className={styles['sub-menu'] +' hidden-mobile'}>
                            <li className={styles["sub-menu-element"]}><Link href='/products/all' passHref replace><a>All products</a></Link></li>
                            <li className={styles["sub-menu-element"]}><Link href="/products/mushrooms"passHref replace><a>Mushrooms</a></Link></li>
                            <li className={styles["sub-menu-element"]}><Link href="/products/equipment" passHref replace><a>Equipment</a></Link></li>
                            <li className={styles["sub-menu-element"]}><Link href="/products/mycological-supplies" passHref replace><a>Mycological supplies</a></Link></li>
                        </ul>
                    </li>
                    <li className={styles["nav-element"]}>
                        <span className={styles["nav-heading"]} onClick={(e)=>{
                            const target = e.target as Element;
                            toggleDisplay(target)}}>Mushrooms</span>
                        <ul className={styles['sub-menu'] +' hidden-mobile'}>
                            <li className={styles["sub-menu-element"]}><Link href="/what-we-grow" passHref replace><a>What we grow</a></Link></li>
                            <li className={styles["sub-menu-element"]}><Link href="/special-requests" passHref replace><a>Special requests</a></Link></li>
                            <li className={styles["sub-menu-element"]}><Link href="/recipes" passHref replace><a>Recipes</a></Link></li>
                            <li className={styles["sub-menu-element"]}><Link href="/share-your-recipes" passHref replace><a>Share your recipes</a></Link></li>
                        </ul>
                    </li>
                    <li className={styles["nav-element"]}>
                        <span className={styles["nav-heading"]} onClick={(e)=>{
                            const target = e.target as Element;
                            toggleDisplay(target)}}>More</span>
                        <ul className={styles['sub-menu'] +' hidden-mobile'}>
                            <li className={styles["sub-menu-element"]}><Link href="/nfts" passHref replace><a>NFTs</a></Link></li>
                            <li className={styles["sub-menu-element"]}><Link href="/cultivation" passHref replace><a>Cultivation method</a></Link></li>
                            <li className={styles["sub-menu-element"]}><Link href="/identification" passHref replace><a>Identify wild mushrooms</a></Link></li>
                        </ul>
                    </li>
                    <li className={styles['nav-element']}>
                        <span className={styles["nav-heading"]} onClick={(e)=>{
                            const target = e.target as Element;
                            toggleDisplay(target)}}>About</span>
                        <ul className={styles['sub-menu'] +' hidden-mobile'}>
                            <li className={styles["sub-menu-element"]}><Link href="/about" passHref replace><a>The Shroom Room</a></Link></li>
                        </ul>
                    </li>
                </ul>
                 
            </nav>
        </header>
    )
}