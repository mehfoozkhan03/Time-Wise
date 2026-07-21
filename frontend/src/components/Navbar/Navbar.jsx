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
  // NEW: Notification Ref
  // ==========================
  const notificationRef = useRef(null);

  // ==========================
  // NEW: Profile Ref
  // ==========================
  const profileRef = useRef(null);

  // ==========================
  // NEW: Close all dropdowns when route changes
  // ==========================
  useEffect(() => {
    setNotificationOpen(false);
    setProfileOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  // ==========================
  // NEW: Close dropdowns when clicking outside
  // ==========================
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="navbar">
      {/* ==========================
              LEFT
      =========================== */}

      <div className="navbar_logo" id="tour-logo">
        <NavLink to="/">
          <div className="logo_text">
            <img src="/Logo_N.svg" alt="Logo" />
          </div>
        </NavLink>
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
          ref={notificationRef} // NEW
        >
          <button
            className="notification_btn"
            onClick={() => {
              // NEW: Close profile
              setProfileOpen(false);

              // NEW: Toggle notification
              setNotificationOpen((prev) => !prev);
            }}
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

        <div
          className="profile_container"
          id="tour-profile"
          ref={profileRef} // NEW
        >
          <button
            className="profile_btn"
            onClick={() => {
              // NEW: Close notification
              setNotificationOpen(false);

              // NEW: Toggle profile
              setProfileOpen((prev) => !prev);
            }}
          >
            <div className="avatar">AK</div>

            <div className="profile_info">
              <h4>Arnav Kharade</h4>

              <span>Frontend Developer</span>
            </div>

            <FaChevronDown
              className={`profile_arrow ${profileOpen ? "rotate" : ""}`}
            />
          </button>

          {profileOpen && (
            <div className="profile_dropdown">
              <NavLink to="/employee" onClick={() => setProfileOpen(false)}>
                My Profile
              </NavLink>

              <NavLink to="/settings" onClick={() => setProfileOpen(false)}>
                Settings
              </NavLink>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  // Logout logic
                }}
              >
                Logout
              </button>
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
