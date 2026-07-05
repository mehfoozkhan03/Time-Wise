import FAQItem from "../FAQItem/FAQItem";
import { FAQData } from "../data/faqData";
import "./FAQ.css";

function FAQ() {

    return (

        <div className="faqContainer">

            <h1>
                Frequently Asked Questions
            </h1>

            <div className="faqGrid">

                {
                    FAQData.map((faq) => (
                        <FAQItem
                            key={faq.id}
                            faq={faq}
                        />
                    ))
                }

            </div>

        </div>
    );
}

export default FAQ;