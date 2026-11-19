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

  // =========================
  // SKELETON UI
  // =========================
  if (showSkeleton) {
    return (
      <div className="helpSupport-container">
        {/* HEADER SKELETON */}
        <div className="helpSupport-header">
          <div>
            <div className="helpSupport-subtitle" style={{ gap: "8px" }}>
              <Skeleton width="14px" height="14px" radius="4px" />
              <Skeleton width="130px" height="12px" />
            </div>
            <div style={{ margin: "8px 0" }}>
              <Skeleton width="180px" height="26px" />
            </div>
            <Skeleton width="340px" height="15px" />
          </div>

          <div
            className="helpSupport-header-icon"
            style={{ border: "none", background: "transparent" }}
          >
            <Skeleton width="65px" height="65px" radius="15px" />
          </div>
        </div>

        <div className="helpSupport-content">
          {/* FAQ SKELETON */}
          <section className="helpSupport-FAQ">
            <div className="helpSupport-section-heading">
              <Skeleton width="40px" height="40px" radius="10px" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <Skeleton width="220px" height="18px" />
                <Skeleton width="240px" height="13px" />
              </div>
              <div style={{ marginLeft: "auto" }}>
                <Skeleton width="90px" height="26px" radius="20px" />
              </div>
            </div>

            <div className="helpSupport-FAQ-list">
              {[1, 2, 3, 4].map((item) => (
                <div
                  className="helpSupport-FAQ-content"
                  key={item}
                  style={{ cursor: "default" }}
                >
                  <div className="helpSupport-FAQ-question">
                    <Skeleton width="22px" height="16px" radius="4px" />
                    <Skeleton width="65%" height="16px" />
                    <Skeleton
                      width="18px"
                      height="18px"
                      radius="4px"
                      style={{ marginLeft: "auto" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CONTACT SUPPORT SKELETON */}
          <section className="helpSupport-contact">
            <div className="helpSupport-section-heading">
              <Skeleton width="40px" height="40px" radius="10px" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <Skeleton width="160px" height="18px" />
                <Skeleton width="260px" height="13px" />
              </div>
            </div>

            <div className="helpSupport-contact-content">
              {[1, 2, 3, 4].map((item) => (
                <div
                  className="helpSupport-contact-card skeleton-card"
                  key={item}
                >
                  <div className="support-card-top">
                    <Skeleton width="42px" height="42px" radius="10px" />
                    <Skeleton width="16px" height="16px" radius="4px" />
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <Skeleton width="130px" height="18px" />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      marginBottom: "14px",
                    }}
                  >
                    <Skeleton width="90%" height="14px" />
                    <Skeleton width="65%" height="14px" />
                  </div>

                  <div className="support-card-bottom">
                    <Skeleton width="140px" height="14px" />
                    <div className="support-card-action">
                      <Skeleton width="90px" height="16px" radius="4px" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* APP VERSION SKELETON */}
          <div className="helpSupport-appVersion">
            <div className="appVersion-info">
              <Skeleton width="38px" height="38px" radius="10px" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <Skeleton width="180px" height="18px" />
                <Skeleton width="280px" height="13px" />
              </div>
            </div>

            <div className="appVersion-right">
              <Skeleton width="100px" height="26px" radius="12px" />
            </div>
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
