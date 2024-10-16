import homeStyles from '../../styles/Pages/Home.module.css'
import Image from 'next/image';
import Link from 'next/link'
// MUSHROOOOOM BULLET POINTS!!!!!
export default function Benefits(){
    return(
        <section id="benefits" className={homeStyles["banner-container"]+" "+"light"}>
            <div className={homeStyles["benefits-wrapper"]}>

            <h1 className={homeStyles["home-section-heading"]+" light"}>Benefits</h1>
            <ul className={homeStyles["card-wrapper"]}>
                <li className={homeStyles["card"]}>
                    <figure className={homeStyles["card-figure"]}>
                    <Image className={homeStyles["card-image"]}src="/antioxidant.webp" alt="antioxidants" fill sizes="(min-width:768px) 30vw, (max-width:767px) 50vw" loading="lazy"/>
                    </figure>
                    
                    <div className={homeStyles["card-text-wrap"]}>
                        <h2 className={`bullet-heading ${homeStyles["benefit-heading"]}`}>Antioxidants</h2>
                        <p className="bullet-margin">The antioxidants in lions mane neutralize free radicals in your body. This means your cells will incur a lot less damage from free radicals as your body actively seeks to eliminate them.</p>
                    </div>
                    
                </li>
                <li className={homeStyles["card"]}>

                <figure className={homeStyles["card-figure"]}>
                    <Image className={homeStyles["card-image"]}src="/brain-neurons-firing.png" alt="cerebral activity" fill sizes="(min-width:768px)30vw, (max-width:767px) 50vw" loading="lazy"/>
                    </figure>
                    <div className={homeStyles["card-text-wrap"]}>
                        <h2 className={`bullet-heading ${homeStyles["benefit-heading"]}`}>Brain health</h2>
                        <p className="bullet-margin">Studies have found that active biological compounds found in lion's mane mushrooms may have neurotrophic effects by inducing the production of nerve growth factor in cells.</p>
                    </div>
                    
                </li>
                <li className={homeStyles["card"]}>

                <figure className={homeStyles["card-figure"]}>
                    <Image className={homeStyles["card-image"]}src="/delicious.jpg" alt="pan of mushie goodness" fill sizes="(min-width:768px) 30vw, (max-width:767px) 50vw" loading="lazy"/>
                    </figure>
                    <div className={homeStyles["card-text-wrap"]}>
                        <h2 className={`bullet-heading ${homeStyles["benefit-heading"]}`}>Delicious!</h2>
                        <p className="bullet-margin">They are quite easy to add to your diet as they complemement the flavour of most meals! They can also be used just as effectively in teas or seasonings of your own choosing after drying and blending.</p>
                    </div>
                </li>
                    
            </ul>
            <h3 className="sub-sub-heading center">Learn more about <Link className="link"href="/what-we-grow">lion's mane</Link>.</h3>
            </div>
        </section>
    )
}