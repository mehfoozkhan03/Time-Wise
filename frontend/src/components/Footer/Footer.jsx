import './Footer.css'

import { Link } from 'react-router-dom'

import { FaLinkedin, FaGithub, FaEnvelope, FaHeart } from 'react-icons/fa'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer_top">
        <div className="footer_brand">
          <img
            src="../frontend/css/utils/Logos/Time_Wise_Logo_DarkMode.svg"
            alt="TimeWise Logo"
            className="footer_logo"
          />

          <p>
            TimeWise is a modern employee management platform designed to
            simplify attendance, collaboration, and workplace productivity.
          </p>
        </div>

        <div className="footer_links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>

          <Link to="/community">Community</Link>

          <Link to="/about">About</Link>

          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer_contact">
          <h3>Support</h3>

          <p>
            <FaEnvelope />
            support@timewise.com
          </p>

          <p>Version 1.0.0</p>
        </div>
      </div>

      <div className="footer_bottom">
        <p>
          © {year} TimeWise. Built with
          <FaHeart className="footer_heart" />
          by Team TimeWise.
        </p>

        <div className="footer_social">
          <a href="#">
            <FaGithub />
          </a>

          <a href="#">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  )
}
