import { useState } from "react";
import "./FAQItem.css";

function FAQItem({faq}) {

    const [open,setOpen] =
    useState(false);

    return (

        <div className="faq">

            <div
                className="question"
                onClick={()=>setOpen(!open)}
            >

                {faq.question}

                <span>
                    {open ? "-" : "+"}
                </span>

            </div>

            {
                open && (
                    <div className="answer">
                        {faq.answer}
                    </div>
                )
            }

        </div>
    );
}

export default FAQItem;