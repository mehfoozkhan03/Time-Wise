import ContactHero
from "../components/Contact/ContactHero/ContactHero.jsx";

import ContactInfo
from "../components/Contact/ContactInfo/ContactInfo.jsx";

import ContactForm
from "../components/Contact/ContactForm/ContactForm.jsx";

import FAQ
from "../components/Contact/FAQ/FAQ.jsx";

import "../styles/Contact.css";

function Contact() {

    return (

        <>
        <div className="contactPage">
            <ContactHero />

            <div className="contactWrapper">

                <ContactInfo />

                <ContactForm />

            </div>

            <FAQ />
        </div>
        </>
    );
}

export default Contact;