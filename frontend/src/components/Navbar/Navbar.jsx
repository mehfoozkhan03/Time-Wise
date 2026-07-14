import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react"; // NEW: Added useRef for notification timer

import "./Navbar.css";
import { FaBell, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { useTour } from "../../hooks/useTour";
import { tourSteps } from "../../tour/tourSteps";

export default function Navbar() {
  const location = useLocation();

  const isHome = location.pathname === "/";

  const [mobileOpen, setMobileOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const [notificationOpen, setNotificationOpen] = useState(false);

  const { triggerTour } = useTour(tourSteps());

  // ==========================
  // NEW: Timer for notification close delay
  // ==========================
  const notificationTimer = useRef(null);

  // ==========================
  // NEW: Close all dropdowns when route changes
  // ==========================
  useEffect(() => {
    setNotificationOpen(false);
    setProfileOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  // ==========================
  // NEW: Clear timer when Navbar unmounts
  // ==========================
  useEffect(() => {
    return () => {
      clearTimeout(notificationTimer.current);
    };
  }, []);

  return (
    <header className="navbar">
      {/* ==========================
              LEFT
      =========================== */}

      <div className="navbar_logo" id="tour-logo">
        <div className="logo_text">
          <img src="/Logo.svg" alt="Logo" />
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

        <div
          className="notification_container"
          id="tour-notifications"

          // NEW: Open notification immediately
          onMouseEnter={() => {
            clearTimeout(notificationTimer.current); // NEW
            setProfileOpen(false); // NEW: Close profile
            setNotificationOpen(true);
          }}

          // NEW: Close notification after small delay
          onMouseLeave={() => {
            notificationTimer.current = setTimeout(() => {
              setNotificationOpen(false);
            }, 200); // NEW: 200ms delay
          }}
        >
          <button
            className="notification_btn"

            // NEW: Optional click support for mobile
            onClick={() => {
              setProfileOpen(false);
              setNotificationOpen((prev) => !prev);
            }}
          >
            <FaBell />

            <span className="notification_count">3</span>
          </button>

          {notificationOpen && (
            <div
              className="notification_dropdown"

              // NEW: Keep dropdown open while hovering it
              onMouseEnter={() => {
                clearTimeout(notificationTimer.current);
              }}

              // NEW: Start close timer after leaving dropdown
              onMouseLeave={() => {
                notificationTimer.current = setTimeout(() => {
                  setNotificationOpen(false);
                }, 200);
              }}
            >
              <h4>Notifications</h4>

              <div className="notification_item">
                Manager approved your leave.
              </div>

              <div className="notification_item">
                John liked your thought.
              </div>

              <div className="notification_item">
                Performance review available.
              </div>

              <button className="view_all_btn">
                View All
              </button>
            </div>
          )}
        </div>

        {/* Profile */}

        <div className="profile_container" id="tour-profile">
          <button
            className="profile_btn"
            onClick={() => {
              // NEW: Close notification before opening profile
              setNotificationOpen(false);
              setProfileOpen((prev) => !prev);
            }}
          >
            <div className="avatar">AK</div>

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

        {isHome && (
          <button
            id="tour-trigger-btn"
            onClick={triggerTour}
            className="tour_trigger_btn"
          >
            Show Demo
          </button>
        )}

        {/* Mobile */}

        <button
          id="tour-mobile-btn"
          className="mobile_btn"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
}