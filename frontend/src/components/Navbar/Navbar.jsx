import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaBell, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";

import "./Navbar.css";
import { useTour } from "../../hooks/useTour";
import { tourSteps } from "../../tour/tourSteps";
import { logout } from "../../store/authSlice";
import { authService } from "../../services/authService";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isHome = location.pathname === "/";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const { triggerTour } = useTour(tourSteps());

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const handleLogout = async () => {
    try {
      await authService.logout();

      dispatch(logout());

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setNotificationOpen(false);
  }, [location.pathname]);

  // Close dropdowns on outside click
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
      {/* =======================
            Logo
      ======================= */}

      <div className="navbar_logo" id="tour-logo">
        <NavLink to="/">
          <div className="logo_text">
            <img src="/Logo_N.svg" alt="Logo" />
          </div>
        </NavLink>
      </div>

      {/* =======================
            Navigation
      ======================= */}

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

      {/* =======================
            Right Side
      ======================= */}

      <div className="navbar_right">
        {/* Notification */}

        <div
          className="notification_container"
          id="tour-notifications"
          ref={notificationRef}
        >
          <button
            className="notification_btn"
            onClick={() => {
              setProfileOpen(false);
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

        <div className="profile_container" id="tour-profile" ref={profileRef}>
          <button
            className="profile_btn"
            onClick={() => {
              setNotificationOpen(false);
              setProfileOpen((prev) => !prev);
            }}
          >
            <div className="avatar">
              {user
                ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
                : "U"}
            </div>

            <div className="profile_info">
              <h4>
                {user
                  ? `${user.firstName
                      ?.charAt(0)
                      .toUpperCase()}${user.firstName?.slice(1)} ${
                      user.lastName?.charAt(0).toUpperCase() +
                      user.lastName?.slice(1)
                    }`
                  : "User"}
              </h4>

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
                onClick={async () => {
                  setProfileOpen(false);
                  await handleLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Show Demo */}

        {isHome && (
          <button
            id="tour-trigger-btn"
            className="tour_trigger_btn"
            onClick={triggerTour}
          >
            Show Demo
          </button>
        )}

        {/* Mobile Menu */}

        <button
          id="tour-mobile-btn"
          className="mobile_btn"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
}
