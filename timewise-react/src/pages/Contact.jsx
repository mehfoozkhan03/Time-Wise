import ContactHero
from "../components/Contact/ContactHero";

import ContactInfo
from "../components/Contact/ContactInfo";

import ContactForm
from "../components/Contact/ContactForm";

import FAQ
from "../components/Contact/FAQ";

import "../styles/Contact.css";

function Contact() {

    return (

        <>
            <ContactHero />

            <div className="contactWrapper">

                <ContactInfo />

                <ContactForm />

            </div>

            <FAQ />

        </>
    );
}

export default Contact;