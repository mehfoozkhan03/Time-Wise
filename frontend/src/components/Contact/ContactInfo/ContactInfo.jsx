import { useState } from "react";

import "./ContactInfo.css";
import { FaEnvelope, FaPhone, FaLocationDot, FaClock } from "react-icons/fa6";

const infoItems = [
  {
    icon: <FaEnvelope />,
    label: "Email",
    detail: "support@timewise.com",
  },
  {
    icon: <FaPhone />,
    label: "Call",
    detail: "+91 98765 43210",
  },
  {
    icon: <FaLocationDot />,
    label: "Location",
    detail: "Mumbai, India",
  },
  {
    icon: <FaClock />,
    label: "Working Hours",
    detail: "9AM - 6PM",
  },
];

function ContactInfo() {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="contactInfo">
      <div className="head">
        <h1>GET IN TOUCH WITH US</h1>
        <p>At TimeWise, we value every user.</p>
      </div>

      <div className="info_parent">
        {infoItems.map((item, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={index}
              className={`infoItem ${isActive ? "infoItem--active" : ""}`}
              onClick={() => handleToggle(index)}
            >
              <span className="infoItem_icon">{item.icon}</span>
              <div className="infoItem_body">
                <h2>{item.label}</h2>
                <p className="infoItem_detail">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ContactInfo;
