import React from 'react';
import styles from '../styles/Components/Footer.module.css'
import Image from 'next/image'
import Link from 'next/link'
export default function Footer(){
    return(
        <footer id="footer" className={styles.footer}>
          <div className={styles.wrapper}>
            <h2 className={styles["footer-heading"]}>Policy</h2>
            <ul className={styles["footer-nav"]}>

              <li className={styles["footer-link"]}><Link href="/cookies"><a>Cookies</a></Link></li>
              <li className={styles["footer-link"]}><Link href="/delivery"><a>Deliveries</a></Link></li>
              <li className={styles["footer-link"]}><Link href="/returns"><a>Returns</a></Link></li>
              <li className={styles["footer-link"]}><Link href="/privacy"><a>Privacy</a></Link></li>
            </ul>
          </div>
        </footer>
    )
}