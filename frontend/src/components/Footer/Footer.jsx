import "./Footer.css";

import { Link } from "react-router-dom";

import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaHeart,
} from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer_top">
        <div className="footer_brand">
          <img
            src="/Time_Wise_Logo_DarkMode.svg"
            alt="TimeWise Logo"
            className="footer_logo"
          />

          <h3>Smarter Employee Management</h3>

          <p>
            TimeWise streamlines attendance tracking, leave management, employee
            collaboration, productivity monitoring, and workplace communication
            through one intelligent workspace. Built for modern organizations,
            it empowers teams with seamless workflows, real-time insights, and a
            better employee experience.
          </p>
        </div>

        <div className="footer_links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/community">Community</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer_contact">
          <h3>Support</h3>

          <p>
            <FaEnvelope />
            <span>support@timewise.com</span>
          </p>

          <p>Mon – Fri • 9:00 AM – 6:00 PM</p>

          <p>Version 1.0.0</p>
        </div>
      </div>

      <div className="footer_bottom">
        <p>
          © {year} TimeWise. Built with <FaHeart className="footer_heart" /> by
          Team TimeWise.
        </p>

        <div className="footer_social">
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