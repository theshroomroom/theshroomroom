export default function ContactUs(){
    return(
        <>
            <h1>Contact Us</h1>
            <p>If you have any queries or suggestions, please don&apos;t hesitate to drop us a line 
            <a href={`mailto:${process.env.COMPANY_EMAIL}`}>by clicking this link</a></p>

        </>
    )
}