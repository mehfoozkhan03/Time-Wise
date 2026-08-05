// import { useState } from "react";
// import FAQItem from "../FAQItem/FAQItem";
// import { FAQData } from "../data/faqData";
// import "./FAQ.css";

// function FAQ() {
//   const [activeIndex, setActiveIndex] = useState(null);

//   const handleToggle = (id) => {
//     setActiveIndex((prev) => (prev === id ? null : id));
//   };

//   return (
//     <div className="faqContainer">
//       <h1>Frequently Asked Questions</h1>

//       <div className="faqGrid">
//         <div className="faqColumn">
//           {FAQData.filter((_, index) => index % 2 === 0).map((faq) => (
//             <FAQItem
//               key={faq.id}
//               faq={faq}
//               open={activeIndex === faq.id}
//               onToggle={() => handleToggle(faq.id)}
//             />
//           ))}
//         </div>

//         <div className="faqColumn">
//           {FAQData.filter((_, index) => index % 2 !== 0).map((faq) => (
//             <FAQItem
//               key={faq.id}
//               faq={faq}
//               open={activeIndex === faq.id}
//               onToggle={() => handleToggle(faq.id)}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FAQ;

import { useState, useEffect } from "react";
import FAQItem from "../FAQItem/FAQItem";
import { FAQData } from "../data/faqData";
import Skeleton from "../../../components/Skeleton/Skeleton";
import "./FAQ.css";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  // skeleton loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleToggle = (id) => {
    setActiveIndex((prev) => (prev === id ? null : id));
  };

  return (
    <div className="faqContainer">
      <h1>Frequently Asked Questions</h1>
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
      )}
    </div>
  );
}

export default FAQ;
