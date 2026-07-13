import './Navbar.css'
// import logo from '../../assets'

import { NavLink } from 'react-router-dom'

import { useState } from 'react'

import { FaBell, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa'

import { useTour } from "../../hooks/useTour";

import tourSteps from "../../tour/tourSteps";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const [notificationOpen, setNotificationOpen] = useState(false);

  const { triggerTour } = useTour(tourSteps);

  return (
    <header className="navbar">
      {/* ==========================
              LEFT
      =========================== */}

      <div className="navbar_logo" id="tour-logo">
        {/* <img src={logo} alt="TimeWise Logo" /> */}

        <div className="logo_text">
          {/* <h2>TimeWise</h2>
          <span>Employee Productivity</span> */}
          <img src="/Time_Wise_Logo_DarkMode.svg" alt="Logo" />
        </div>
      </div>

      {/* ==========================
            CENTER
      =========================== */}

      <nav
        className={`navbar_links ${mobileOpen ? "active" : ""}`}
        id="tour-nav-links"
      >
        <NavLink to="/">Home</NavLink>

        <NavLink to="/dashboard">Dashboard</NavLink>

        <NavLink to="/community">Community</NavLink>

        <NavLink to="/about">About</NavLink>

        <NavLink to="/contact">Contact</NavLink>
      </nav>

      {/* ==========================
              RIGHT
      =========================== */}

      <div className="navbar_right">
        {/* Notification */}

        <div className="notification_container" id="tour-notifications">
          <button
            className="notification_btn"
            onClick={() => setNotificationOpen(!notificationOpen)}
          >
            <FaBell />

            <span className="notification_count">3</span>
          </button>

          {notificationOpen && (
            <div className="notification_dropdown">
              <h4>Notifications</h4>

              <div className="notification_item">
                Manager approved your leave.
              </div>

              <div className="notification_item">John liked your thought.</div>

              <div className="notification_item">
                Performance review available.
              </div>

              <button className="view_all_btn">View All</button>
            </div>
          )}
        </div>

        {/* Profile */}

        <div className="profile_container" id="tour-profile">
          <button
            className="profile_btn"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="avatar1">AK</div>

            <div className="profile_info">
              <h4>Arnav Kharade</h4>

              <span>Frontend Developer</span>
            </div>

            <FaChevronDown />
          </button>

          {profileOpen && (
            <div className="profile_dropdown">
              <NavLink to="/employee">My Profile</NavLink>

              <NavLink to="/settings">Settings</NavLink>

              <button>Logout</button>
            </div>
          )}
        </div>

        <button
          onClick={triggerTour}
          className="tour_trigger_btn"
          aria-label="Start Product Tour"
        >
          Show Demo
        </button>

        {/* Mobile */}

        <button
          className="mobile_btn"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
}
