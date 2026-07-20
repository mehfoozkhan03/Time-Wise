import "./ContactInfo.css";
import { FaEnvelope, FaPhone, FaLocationDot, FaClock } from "react-icons/fa6";

function ContactInfo() {
  return (
    <div className="contactInfo">
      <div className="head">
        <h1>GET IN TOUCH WITH US</h1>

        <p>At TimeWise, we value every user.</p>
      </div>

      <div className="info_parent">
        <div className="infoItem">
          <FaEnvelope />
          <div>
            <h2>Email</h2>
            <p>support@timewise.com</p>
          </div>
        </div>

        <div className="infoItem">
          <FaPhone />
          <div>
            <h2>Call</h2>
            <p>+91 98765 43210</p>
          </div>
        </div>

        <div className="infoItem">
          <FaLocationDot />
          <div>
            <h2>Location</h2>
            <p>Mumbai, India</p>
          </div>
        </div>

        <div className="infoItem">
          <FaClock />
          <div>
            <h2>Working Hours</h2>
            <p>9AM - 6PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;
