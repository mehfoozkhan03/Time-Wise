import "./FAQ.css";
import FAQItem from "../FAQItem";
import {FAQData} from "../data/faqData";

function FAQ(){

    return(

        <div className="faqContainer">

            <h1>
                Frequently Asked Questions
            </h1>

            {
                FAQData.map((faq)=>(
                    <FAQItem
                        key={faq.id}
                        faq={faq}
                    />
                ))
            }

        </div>
    );
}

export default FAQ;