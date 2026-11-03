// import { useState, useEffect } from "react";

// import { MdKeyboardArrowDown } from "react-icons/md";
// import { IoIosArrowRoundForward } from "react-icons/io";

// import Skeleton from "../../../components/Skeleton/Skeleton";

// import "./HelpSupport.css";

// export const HelpSupport = () => {
//   const [openIndex, setOpenIndex] = useState(null);

//   // Skeleton State
//   const [showSkeleton, setShowSkeleton] = useState(true);

//   // FAQ Data
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

//   const toggleFAQ = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   // =========================
//   // SKELETON TIMER
//   // =========================
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowSkeleton(false);
//     }, 1500);

//     return () => clearTimeout(timer);
//   }, []);

//   // =========================
//   // SKELETON UI
//   // =========================
//   if (showSkeleton) {
//     return (
//       <div className="helpSupport-container">
//         {/* Header */}
//         <div className="helpSupport-header">
//           <Skeleton width="180px" height="28px" />

//           <div className="help-skeleton-gap">
//             <Skeleton width="380px" height="16px" />
//           </div>
//         </div>

//         <div className="helpSupport-content">

//           {/* FAQ Skeleton */}
//           <div className="helpSupport-FAQ">
//             <div className="helpSupport-FAQ-heading">
//               <Skeleton width="250px" height="22px" />
//             </div>

//             {[1, 2, 3, 4].map((item) => (
//               <div className="help-skeleton-faq" key={item}>
//                 <Skeleton width="70%" height="18px" />

//                 <Skeleton width="28px" height="28px" radius="50%" />
//               </div>
//             ))}
//           </div>

//           {/* Contact Support Skeleton */}
//           <div className="helpSupport-contact">
//             <div className="helpSupport-contact-heading">
//               <Skeleton width="180px" height="22px" />
//             </div>

//             <div className="helpSupport-contact-content">
//               {[1, 2, 3, 4].map((item) => (
//                 <div className="help-skeleton-contact" key={item}>
//                   <div className="help-skeleton-contact-info">
//                     <Skeleton width="150px" height="18px" />
//                     <Skeleton width="220px" height="14px" />
//                   </div>

//                   <Skeleton width="100px" height="18px" />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* App Version Skeleton */}
//           <div className="helpSupport-appVersion">
//             <div className="appVersion-heading">
//               <Skeleton width="100px" height="16px" />
//               <Skeleton width="130px" height="18px" />
//             </div>

//             <Skeleton width="90px" height="30px" radius="15px" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // =========================
//   // ORIGINAL UI
//   // =========================
//   return (
//     <div className="helpSupport-container">
//       <div className="helpSupport-header">
//         <h3>Help & Support</h3>
//         <span>Find answers, reach our team, or report an issue.</span>
//       </div>

//       <div className="helpSupport-content">

//         {/* FAQ */}
//         <div className="helpSupport-FAQ">
//           <div className="helpSupport-FAQ-heading">
//             <h3>Frequently asked questions</h3>
//           </div>

//           {faqs.map((faq, index) => (
//             <div
//               key={index}
//               onClick={() => toggleFAQ(index)}
//               className="helpSupport-FAQ-content"
//             >
//               <div className="helpSupport-FAQ-question">
//                 <p>{faq.question}</p>
//                 <MdKeyboardArrowDown />
//               </div>

//               {openIndex === index && (
//                 <div className="helpSupport-FAQ-answer">
//                   <p>{faq.answer}</p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Contact Support */}
//         <div className="helpSupport-contact">
//           <div className="helpSupport-contact-heading">
//             <h3>Contact support</h3>
//           </div>

//           <div className="helpSupport-contact-content">

//             {/* Email */}
//             <div>
//               <div className="helpSupport-contact-title">
//                 <p>Email Support</p>
//                 <span>We reply within 4 hours</span>
//               </div>

//               <div className="helpSupport-contact-request">
//                 <p>Send Email</p>
//                 <IoIosArrowRoundForward
//                   style={{ color: "#3eb5e8" }}
//                 />
//               </div>
//             </div>

//             {/* Live Chat */}
//             <div>
//               <div className="helpSupport-contact-title">
//                 <p>Live Chat</p>
//                 <span>Available Mon-Fri, 9am-6pm PT</span>
//               </div>

//               <div className="helpSupport-contact-request">
//                 <p>Start chat</p>
//                 <IoIosArrowRoundForward
//                   style={{ color: "#3eb5e8" }}
//                 />
//               </div>
//             </div>

//             {/* Help Center */}
//             <div>
//               <div className="helpSupport-contact-title">
//                 <p>Help center</p>
//                 <span>Browse 200+ articles</span>
//               </div>

//               <div className="helpSupport-contact-request">
//                 <p>Open docs</p>
//                 <IoIosArrowRoundForward
//                   style={{ color: "#3eb5e8" }}
//                 />
//               </div>
//             </div>

//             {/* Report Bug */}
//             <div>
//               <div className="helpSupport-contact-title">
//                 <p>Report a bug</p>
//                 <span>Help us improve the product</span>
//               </div>

//               <div className="helpSupport-contact-request">
//                 <p>Submit report</p>
//                 <IoIosArrowRoundForward
//                   style={{ color: "#3eb5e8" }}
//                 />
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* App Version */}
//         <div className="helpSupport-appVersion">
//           <div className="appVersion-heading">
//             <span>App version</span>
//             <p>TimeTrack v3.8.1</p>
//           </div>

//           <div className="up-to-date">
//             Up to date
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


import { useState, useEffect } from "react";

import {
  FaEnvelope,
  FaComments,
  FaBookOpen,
  FaBug,
  FaHeadset,
  FaArrowRight,
  FaCheckCircle,
  FaQuestionCircle,
  FaChevronDown,
} from "react-icons/fa";

import Skeleton from "../../../components/Skeleton/Skeleton";

import "./HelpSupport.css";

export const HelpSupport = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(true);

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

  const supportOptions = [
    {
      icon: <FaEnvelope />,
      title: "Email Support",
      description: "Get assistance directly from our support team.",
      availability: "We reply within 4 hours",
      action: "Send Email",
      className: "email-support",
    },
    {
      icon: <FaComments />,
      title: "Live Chat",
      description: "Chat with our team and get instant assistance.",
      availability: "Available Mon-Fri, 9am-6pm",
      action: "Start Chat",
      className: "chat-support",
    },
    {
      icon: <FaBookOpen />,
      title: "Help Center",
      description: "Explore guides and helpful documentation.",
      availability: "Browse helpful articles",
      action: "Open Docs",
      className: "docs-support",
    },
    {
      icon: <FaBug />,
      title: "Report a Bug",
      description: "Found something unusual? Let us know.",
      availability: "Help us improve TimeWise",
      action: "Submit Report",
      className: "bug-support",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // SKELETON UI
  if (showSkeleton) {
    return (
      <div className="helpSupport-container">
        <div className="helpSupport-header">
          <Skeleton width="180px" height="28px" />
          <Skeleton width="320px" height="15px" />
        </div>

        <div className="helpSupport-content">
          <div className="helpSupport-FAQ">
            <div className="helpSupport-FAQ-heading">
              <Skeleton width="220px" height="22px" />
            </div>

            {[1, 2, 3, 4].map((item) => (
              <div className="help-skeleton-faq" key={item}>
                <Skeleton width="70%" height="18px" />
                <Skeleton width="28px" height="28px" radius="50%" />
              </div>
            ))}
          </div>

          <div className="helpSupport-contact">
            <div className="helpSupport-contact-heading">
              <Skeleton width="180px" height="22px" />
            </div>

            <div className="helpSupport-contact-content">
              {[1, 2, 3, 4].map((item) => (
                <div className="help-skeleton-contact" key={item}>
                  <Skeleton width="150px" height="18px" />
                  <Skeleton width="220px" height="14px" />
                  <Skeleton width="100px" height="18px" />
                </div>
              ))}
            </div>
          </div>

          <div className="helpSupport-appVersion">
            <Skeleton width="150px" height="18px" />
            <Skeleton width="100px" height="28px" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="helpSupport-container">

      {/* PAGE HEADER */}
      <div className="helpSupport-header">
        <div>
          <div className="helpSupport-subtitle">
            <FaHeadset />
            <span>WE ARE HERE TO HELP</span>
          </div>

          <h3>Help & Support</h3>

          <p>
            Find answers to your questions or get in touch
            with our support team.
          </p>
        </div>

        <div className="helpSupport-header-icon">
          <FaHeadset />
        </div>
      </div>

      <div className="helpSupport-content">

        {/* FAQ SECTION */}
        <section className="helpSupport-FAQ">

          <div className="helpSupport-section-heading">
            <div className="helpSupport-heading-icon">
              <FaQuestionCircle />
            </div>

            <div>
              <h3>Frequently Asked Questions</h3>
              <p>Quick answers to common questions.</p>
            </div>

            <span className="helpSupport-count">
              {faqs.length} Questions
            </span>
          </div>

          <div className="helpSupport-FAQ-list">
            {faqs.map((faq, index) => (
              <div
  className={`helpSupport-FAQ-content ${
    openIndex === index ? "faq-active" : ""
  }`}
  key={index}
  onClick={() => toggleFAQ(index)}
>
  <div className="helpSupport-FAQ-question">
    <span className="faq-number">
      {String(index + 1).padStart(2, "0")}
    </span>

    <p>{faq.question}</p>

    <FaChevronDown
      className={`faq-arrow ${
        openIndex === index ? "faq-arrow-active" : ""
      }`}
    />
  </div>

  <div
    className={`helpSupport-FAQ-answer-wrapper ${
      openIndex === index ? "answer-open" : ""
    }`}
  >
    <div className="helpSupport-FAQ-answer">
      <p>{faq.answer}</p>
    </div>
  </div>
</div>
            ))}
          </div>
        </section>

        {/* CONTACT SUPPORT */}
        <section className="helpSupport-contact">

          <div className="helpSupport-section-heading">
            <div className="helpSupport-heading-icon">
              <FaHeadset />
            </div>

            <div>
              <h3>Contact Support</h3>
              <p>Choose how you would like to connect with us.</p>
            </div>
          </div>

          <div className="helpSupport-contact-content">
            {supportOptions.map((option, index) => (
              <div
                className={`helpSupport-contact-card ${option.className}`}
                key={index}
              >
                <div className="support-card-top">
                  <div className="support-card-icon">
                    {option.icon}
                  </div>

                  <FaArrowRight className="support-card-arrow" />
                </div>

                <h4>{option.title}</h4>

                <p className="support-card-description">
                  {option.description}
                </p>

                <div className="support-card-bottom">
                  <span>{option.availability}</span>

                  <div className="support-card-action">
                    {option.action}
                    <FaArrowRight />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* APP VERSION */}
        <div className="helpSupport-appVersion">

          <div className="appVersion-info">
            <div className="appVersion-icon">
              <FaCheckCircle />
            </div>

            <div>
              <h4>TimeWise is up to date</h4>
              <p>You're using the latest version of our application.</p>
            </div>
          </div>

          <div className="appVersion-right">
            <span>VERSION</span>
            <strong>v3.8.1</strong>
            <span className="up-to-date">
              <FaCheckCircle />
              Up to date
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
