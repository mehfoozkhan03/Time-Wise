import "./ContactHero.css";
import { useEffect, useState } from "react";
import Skeleton from "../../../components/Skeleton/Skeleton";

const CONTACT_IMAGE_URL =
  "https://raw.githubusercontent.com/hetuk2005/webDevelopment/refs/heads/main/Utils/Contact.jpg";

function ContactHero() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer;

    const img = new Image();

    const handleImageLoad = () => {
      timer = setTimeout(() => {
        setLoading(false);
      }, 1500);
    };

    const handleImageError = () => {
      setLoading(false);
    };

    img.onload = handleImageLoad;
    img.onerror = handleImageError;
    img.src = CONTACT_IMAGE_URL;

    return () => {
      clearTimeout(timer);
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  return (
    <div className={`contactHero ${loading ? "loading" : ""}`}>
      {loading ? (
        <>
          <Skeleton width="180px" height="50px" radius="10px" />

          <Skeleton
            width="50%"
            height="30px"
            radius="8px"
            className="contact-skeleton-text"
          />

          <Skeleton width="30%" height="30px" radius="8px" />
        </>
      ) : (
        <>
          <h1>Contact Us</h1>

          <p>
            We're always happy to hear from you. Get in touch with our team for
            support, suggestions, or questions.
          </p>
        </>
      )}
    </div>
  );
}

export default ContactHero;