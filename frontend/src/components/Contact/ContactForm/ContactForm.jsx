import { useState } from "react";
import "./ContactForm.css";

function ContactForm() {

    const questions = [
        "What is your return policy?",
        "Do you offer customer support?",
        "How long does shipping take?",
        "Can I cancel my order?",
        "How can I contact support?"
    ];

    const answers = [
        "You can return any product within 30 days of purchase.",

        "Yes, 24/7 customer support is available via email and chat.",

        "Our standard delivery time is between 3-7 business days.",

        "Yes, you can update or cancel your order before it is dispatched.",

        "You can contact us through email, phone, or the contact form below."
    ];

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        faq: "",
        subject: "",
        message: ""
    });

    const [selectedAnswer, setSelectedAnswer] = useState("");

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Show answer when question is selected
        if (name === "faq") {
            setSelectedAnswer(
                value !== ""
                    ? answers[Number(value)]
                    : ""
            );
        }
    };

    const submit = (e) => {

        e.preventDefault();

        console.log(formData);

        alert("Message Sent Successfully!");
    };

    return (

        <div className="formPart">

            <form onSubmit={submit}>

                <div className="inputs">

                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                </div>

                <select
                    name="faq"
                    value={formData.faq}
                    onChange={handleChange}
                >
                    <option value="">
                        Select Question
                    </option>

                    {
                        questions.map((question, index) => (
                            <option
                                key={index}
                                value={index}
                            >
                                {question}
                            </option>
                        ))
                    }

                </select>

                {/* Always render this element */}
                <p className="faqAnswer">
                    {selectedAnswer}
                </p>

                <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                />

                <textarea
                    rows="6"
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                />

                <button
                    type="submit"
                    className="btn"
                >
                    Send Message
                </button>

            </form>

        </div>
    );
}

export default ContactForm;