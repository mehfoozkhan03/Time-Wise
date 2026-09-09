// import { useState } from "react";

// import { MdKeyboardArrowDown } from "react-icons/md";
// import { IoIosArrowRoundForward } from "react-icons/io";
// import "./HelpSupport.css";

// export const HelpSupport = () => {
//   const [openIndex, setOpenIndex] = useState(null);

//   const toggleFAQ = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };
//   const faqs = [
//     {
//       question: "How do I correct a missed check-in?",
//       answer:
//         "Navigate to Attendance → Manual Entry and submit a correction request. Your manager will be notified to approve it.",
//     },
//     {
//       question: "Why is my overtime not showing up?",
//       answer:
//         "Overtime is calculated at end-of-day. If it's still missing after 24 hours, contact your HR admin.",
//     },
//     {
//       question: "How do I apply for leave?",
//       answer:
//         "Go to Leave → Apply and select your leave type and dates. You'll receive an email once it's approved.",
//     },
//     {
//       question: "Can I export data for multiple employees?",
//       answer:
//         "Bulk export is available to Organization admins under Data & Export → Team Reports.",
//     },
//   ];

//   return (
//     <>
//       <div className="helpSupport-container">
//         <div className="helpSupport-header">
//           <h3>Help & Support</h3>
//           <span>Find answers, reach our team, or report an issue.</span>
//         </div>
//         <div className="helpSupport-content">
//           <div className="helpSupport-FAQ">
//             <div className="helpSupport-FAQ-heading">
//               <h3>Frequently asked questions</h3>
//             </div>

//             {faqs.map((faq, index) => (
//               <div
//                 key={index}
//                 onClick={() => toggleFAQ(index)}
//                 className="helpSupport-FAQ-content"
//               >
//                 <div className="helpSupport-FAQ-question">
//                   <p>{faq.question}</p>
//                   <MdKeyboardArrowDown />
//                 </div>

//                 {openIndex === index && (
//                   <div className="helpSupport-FAQ-answer">
//                     <p>{faq.answer}</p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <div className="helpSupport-contact">
//             <div className="helpSupport-contact-heading">
//               <h3>Contact support</h3>
//             </div>
//             <div className="helpSupport-contact-content">
//               <div>
//                 <div className="helpSupport-contact-title">
//                   <p>Email Support</p>
//                   <span>We reply within 4 hours</span>
//                 </div>
//                 <div className="helpSupport-contact-request">
//                   <p>Send Email</p>
//                   <IoIosArrowRoundForward style={{ color: "#3eb5e8" }} />
//                 </div>
//               </div>
//               <div>
//                 <div className="helpSupport-contact-title">
//                   <p>Live Chat</p>
//                   <span>Available Mon-Fri, 9am-6pm PT</span>
//                 </div>
//                 <div className="helpSupport-contact-request">
//                   <p>Start chat</p>
//                   <IoIosArrowRoundForward style={{ color: "#3eb5e8" }} />
//                 </div>
//               </div>
//               <div>
//                 <div className="helpSupport-contact-title">
//                   <p>Help center</p>
//                   <span>Browse 200+ articles</span>
//                 </div>
//                 <div className="helpSupport-contact-request">
//                   <p>Open docs</p>
//                   <IoIosArrowRoundForward style={{ color: "#3eb5e8" }} />
//                 </div>
//               </div>
//               <div>
//                 <div className="helpSupport-contact-title">
//                   <p>Report a bug</p>
//                   <span>Help us improve the product</span>
//                 </div>
//                 <div className="helpSupport-contact-request">
//                   <p>Submit report</p>
//                   <IoIosArrowRoundForward style={{ color: "#3eb5e8" }} />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="helpSupport-appVersion">
//             <div className="appVersion-heading">
//               <span>App version</span>
//               <p>TimeTrack v3.8.1</p>
//             </div>
//             <div className="up-to-date">Up to date</div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };


import { useState, useEffect } from "react";

import { MdKeyboardArrowDown } from "react-icons/md";
import { IoIosArrowRoundForward } from "react-icons/io";

import Skeleton from "../../../components/Skeleton/Skeleton";

import "./HelpSupport.css";

export const HelpSupport = () => {
  const [openIndex, setOpenIndex] = useState(null);

  // Skeleton State
  const [showSkeleton, setShowSkeleton] = useState(true);

  // FAQ Data
  const faqs = [
    {
      question: "How do I correct a missed check-in?",
      answer:
        "Navigate to Attendance → Manual Entry and submit a correction request. Your manager will be notified to approve it.",
    },
    {
      question: "Why is my overtime not showing up?",
      answer:
        "Overtime is calculated at end-of-day. If it's still missing after 24 hours, contact your HR admin.",
    },
    {
      question: "How do I apply for leave?",
      answer:
        "Go to Leave → Apply and select your leave type and dates. You'll receive an email once it's approved.",
    },
    {
      question: "Can I export data for multiple employees?",
      answer:
        "Bulk export is available to Organization admins under Data & Export → Team Reports.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // =========================
  // SKELETON TIMER
  // =========================
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // =========================
  // SKELETON UI
  // =========================
  if (showSkeleton) {
    return (
      <div className="helpSupport-container">
        {/* Header */}
        <div className="helpSupport-header">
          <Skeleton width="180px" height="28px" />

          <div className="help-skeleton-gap">
            <Skeleton width="380px" height="16px" />
          </div>
        </div>

        <div className="helpSupport-content">

          {/* FAQ Skeleton */}
          <div className="helpSupport-FAQ">
            <div className="helpSupport-FAQ-heading">
              <Skeleton width="250px" height="22px" />
            </div>

            {[1, 2, 3, 4].map((item) => (
              <div className="help-skeleton-faq" key={item}>
                <Skeleton width="70%" height="18px" />

                <Skeleton width="28px" height="28px" radius="50%" />
              </div>
            ))}
          </div>

          {/* Contact Support Skeleton */}
          <div className="helpSupport-contact">
            <div className="helpSupport-contact-heading">
              <Skeleton width="180px" height="22px" />
            </div>

            <div className="helpSupport-contact-content">
              {[1, 2, 3, 4].map((item) => (
                <div className="help-skeleton-contact" key={item}>
                  <div className="help-skeleton-contact-info">
                    <Skeleton width="150px" height="18px" />
                    <Skeleton width="220px" height="14px" />
                  </div>

                  <Skeleton width="100px" height="18px" />
                </div>
              ))}
            </div>
          </div>

          {/* App Version Skeleton */}
          <div className="helpSupport-appVersion">
            <div className="appVersion-heading">
              <Skeleton width="100px" height="16px" />
              <Skeleton width="130px" height="18px" />
            </div>

            <Skeleton width="90px" height="30px" radius="15px" />
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // ORIGINAL UI
  // =========================
  return (
    <div className="helpSupport-container">
      <div className="helpSupport-header">
        <h3>Help & Support</h3>
        <span>Find answers, reach our team, or report an issue.</span>
      </div>

      <div className="helpSupport-content">

        {/* FAQ */}
        <div className="helpSupport-FAQ">
          <div className="helpSupport-FAQ-heading">
            <h3>Frequently asked questions</h3>
          </div>

          {faqs.map((faq, index) => (
            <div
              key={index}
              onClick={() => toggleFAQ(index)}
              className="helpSupport-FAQ-content"
            >
              <div className="helpSupport-FAQ-question">
                <p>{faq.question}</p>
                <MdKeyboardArrowDown />
              </div>

              {openIndex === index && (
                <div className="helpSupport-FAQ-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="helpSupport-contact">
          <div className="helpSupport-contact-heading">
            <h3>Contact support</h3>
          </div>

          <div className="helpSupport-contact-content">

            {/* Email */}
            <div>
              <div className="helpSupport-contact-title">
                <p>Email Support</p>
                <span>We reply within 4 hours</span>
              </div>

              <div className="helpSupport-contact-request">
                <p>Send Email</p>
                <IoIosArrowRoundForward
                  style={{ color: "#3eb5e8" }}
                />
              </div>
            </div>

            {/* Live Chat */}
            <div>
              <div className="helpSupport-contact-title">
                <p>Live Chat</p>
                <span>Available Mon-Fri, 9am-6pm PT</span>
              </div>

              <div className="helpSupport-contact-request">
                <p>Start chat</p>
                <IoIosArrowRoundForward
                  style={{ color: "#3eb5e8" }}
                />
              </div>
            </div>

            {/* Help Center */}
            <div>
              <div className="helpSupport-contact-title">
                <p>Help center</p>
                <span>Browse 200+ articles</span>
              </div>

              <div className="helpSupport-contact-request">
                <p>Open docs</p>
                <IoIosArrowRoundForward
                  style={{ color: "#3eb5e8" }}
                />
              </div>
            </div>

            {/* Report Bug */}
            <div>
              <div className="helpSupport-contact-title">
                <p>Report a bug</p>
                <span>Help us improve the product</span>
              </div>

              <div className="helpSupport-contact-request">
                <p>Submit report</p>
                <IoIosArrowRoundForward
                  style={{ color: "#3eb5e8" }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* App Version */}
        <div className="helpSupport-appVersion">
          <div className="appVersion-heading">
            <span>App version</span>
            <p>TimeTrack v3.8.1</p>
          </div>

          <div className="up-to-date">
            Up to date
          </div>
        </div>
      </div>
    </div>
  );
};