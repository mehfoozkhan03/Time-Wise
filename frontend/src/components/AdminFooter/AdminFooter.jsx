import { FaLinkedin, FaGithub, FaHeart, FaEnvelope } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

import "./AdminFooter.css";

export default function AdminFooter() {
  const year = new Date().getFullYear();
  const { resolvedTheme } = useTheme();

  return (
    <footer className="admin_footer">
      <div className="admin_footer_container">

        {/* Logo */}
        <div className="admin_footer_brand">
          <img
            src={
              resolvedTheme === "dark"
                ? "/Logo_F.svg"
                : "/Logo_F_Light.svg"
            }
            alt="Logo"
            className="admin_footer_logo"
          />
        </div>

        {/* Copyright */}
        <div className="admin_footer_bottom_text">
          <p>© {year} TimeWise. Built With</p>

          <FaHeart className="admin_footer_heart" />

          <p>By Team TimeWise.</p>
        </div>

        {/* Support */}
        <div className="admin_footer_contact">
          {/* <h3>Support</h3> */}

          <p>
            <FaEnvelope />
            <span>support@timewise.com</span>
          </p>

          <p>Mon - Fri • 9:00 AM - 6:00 PM</p>

          <p>Version 1.0.0</p>
        </div>

        {/* Social Icons */}
        <div className="admin_footer_social">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>

          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
        </div>

      </div>
    </footer>
  );
}