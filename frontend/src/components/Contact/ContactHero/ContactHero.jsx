// import "./ContactHero.css";

// function ContactHero() {

//     return (
//         <div className="contactHero">

//             <h1>Contact Us</h1>

//             <p>
//                 We're always happy to hear from you.
//                 Get in touch with our team for support,
//                 suggestions, or questions.
//             </p>

//         </div>
//     );
// }

// export default ContactHero;

import "./ContactHero.css";
import { useEffect, useState } from "react";
import Skeleton from "../../../components/Skeleton/Skeleton";

function ContactHero() {

    const [loading, setLoading] = useState(true);


 useEffect(() => {

    const img = new Image();

    img.src =
    "https://raw.githubusercontent.com/hetuk2005/webDevelopment/refs/heads/main/Utils/Contact.jpg";


    img.onload = () => {

        setTimeout(() => {
            setLoading(false);
        }, 1500); // 2 sec skeleton show hoga

    };


}, []);



    return (

        <div 
            className={`contactHero ${loading ? "loading" : ""}`}
        >

            {
                loading ?

                (
                    <>

                          <Skeleton
                            width="180px"
                            height="50px"
                            radius="10px"
                        />


                        <Skeleton
                            width="50%"
                            height="30px"
                            radius="8px"
                            className="contact-skeleton-text"
                        />


                        <Skeleton
                            width="30%"
                            height="30px"
                            radius="8px"
                        />

                    </>
                )

                :

                (
                    <>
                        <h1>
                            Contact Us
                        </h1>

                        <p>
                            We're always happy to hear from you.
                            Get in touch with our team for support,
                            suggestions, or questions.
                        </p>
                    </>
                )

            }


        </div>
    );
}

export default ContactHero;