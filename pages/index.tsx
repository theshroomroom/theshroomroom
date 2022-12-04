import type { NextPage } from 'next';
import HomeBanner from '../components/banner'
import Carousel from '../components/carousel'
import {CarouselHomeNewArrivals} from '../utils/carouselConfig/home.module'
import styles from '../styles/Pages/Home.module.css'
const Home: NextPage = () => {
  // useEffect(()=>{
  //   const initiateSession=async()=>{
  //     const session = await getSession()
  //     console.log(session)
  //   }
  //   initiateSession()
  
  // })
  return (
    <>
        <HomeBanner id="#homeBanner" src={'/openingImage'} width={300} height={168}fileType={'jpg'}alt={'Opening day is upon us'}/>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">The Shroom Room!</a>
        </h1>

       <Carousel imageProps={CarouselHomeNewArrivals} />
      </>
  )
}

export default Home
