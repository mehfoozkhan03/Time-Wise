import FAQItem from "../FAQItem/FAQItem";
import { FAQData } from "../data/faqData";
import "./FAQ.css";

function FAQ() {

    const mid =
        Math.ceil(
            FAQData.length / 2
        );

    const leftFAQ =
        FAQData.slice(0, mid);

    const rightFAQ =
        FAQData.slice(mid);

    return (

        <div className="faqContainer">

            <h1>
                Frequently Asked Questions
            </h1>

            <div className="faqGrid">

                <div className="faqColumn">

                    {
                        leftFAQ.map((faq) => (
                            <FAQItem
                                key={faq.id}
                                faq={faq}
                            />
                        ))
                    }

                </div>

                <div className="faqColumn">

                    {
                        rightFAQ.map((faq) => (
                            <FAQItem
                                key={faq.id}
                                faq={faq}
                            />
                        ))
                    }

                </div>

            </div>

        </div>
    );
}


export default FAQ;