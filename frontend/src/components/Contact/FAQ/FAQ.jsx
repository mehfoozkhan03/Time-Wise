import { useState } from "react";
import FAQItem from "../FAQItem/FAQItem";
import { FAQData } from "../data/faqData";
import "./FAQ.css";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (id) => {
    setActiveIndex((prev) => (prev === id ? null : id));
  };

  return (
    <div className="faqContainer">
      <h1>Frequently Asked Questions</h1>

      <div className="faqGrid">
        <div className="faqColumn">
          {FAQData.filter((_, index) => index % 2 === 0).map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              open={activeIndex === faq.id}
              onToggle={() => handleToggle(faq.id)}
            />
          ))}
        </div>

        <div className="faqColumn">
          {FAQData.filter((_, index) => index % 2 !== 0).map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              open={activeIndex === faq.id}
              onToggle={() => handleToggle(faq.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQ;
