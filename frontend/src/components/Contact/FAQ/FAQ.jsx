import { useState, useEffect, useMemo, useCallback } from "react";
import FAQItem from "../FAQItem/FAQItem";
import { FAQData } from "../data/faqData";
import Skeleton from "../../../components/Skeleton/Skeleton";
import "./FAQ.css";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleToggle = useCallback((id) => {
    setActiveIndex((prev) => (prev === id ? null : id));
  }, []);

  const { leftFAQs, rightFAQs } = useMemo(
    () => ({
      leftFAQs: FAQData.filter((_, index) => index % 2 === 0),
      rightFAQs: FAQData.filter((_, index) => index % 2 !== 0),
    }),
    []
  );

  return (
    <div className="faqContainer">
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <Skeleton width="550px" height="45px" radius="8px" />
        </div>
      ) : (
        <h1>Frequently Asked Questions</h1>
      )}

      {loading ? (
        <div className="faqSkeletonGrid">
          <div className="faqColumn">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} width="100%" height="60px" radius="10px" />
            ))}
          </div>

          <div className="faqColumn">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} width="100%" height="60px" radius="10px" />
            ))}
          </div>
        </div>
      ) : (
        <div className="faqGrid">
          <div className="faqColumn">
            {leftFAQs.map((faq) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                open={activeIndex === faq.id}
                onToggle={() => handleToggle(faq.id)}
              />
            ))}
          </div>

          <div className="faqColumn">
            {rightFAQs.map((faq) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                open={activeIndex === faq.id}
                onToggle={() => handleToggle(faq.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FAQ;