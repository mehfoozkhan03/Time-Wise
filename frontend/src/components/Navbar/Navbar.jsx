import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaBell, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";

import { markNotificationAsRead } from "../../services/notificationServices";
import "./Navbar.css";
import { logout } from "../../store/authSlice";
import { authService } from "../../services/authService";
import { useTheme } from "../../context/ThemeContext";
import { fetchNotifications } from ".././../store/notificationSlice";
import { Feedback } from "../../pages/FeedBack";

export default function Navbar() {
  const { notifications, loading } = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNotificationClick = async (notification) => {
  try {
    // Mark as read only if unread
    if (!notification.read) {
      await markNotificationAsRead(notification._id);

      // Refresh notifications
      dispatch(fetchNotifications());
    }

    // Close notification dropdown
    setNotificationOpen(false);

    // Navigate based on notification type
    if (
      notification.referenceModel === "Post" &&
      notification.referenceId
    ) {
      navigate(`/community/post/${notification.referenceId}`);
    }
  } catch (error) {
    console.error("Notification Click Error:", error);
  }
};

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const { resolvedTheme } = useTheme();

  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isHome = location.pathname === "/";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const confirmLogout = async () => {
    try {
      setLogoutOpen(false);

      await authService.logout();

      dispatch(logout());

      navigate("/signup");
    } catch (error) {
      console.log(error);
    }
  };

  const getLogoutContent = () => {
    const today = new Date().getDay();

    const firstName =
      user?.firstName?.charAt(0).toUpperCase() + user?.firstName?.slice(1) ||
      "User";

    if (today >= 1 && today <= 4) {
      return {
        title: `Goodbye, ${firstName}! 👋`,
        message:
          "That's a wrap for today! Great work. Take some time to relax and recharge — We'll be ready for another productive day tomorrow.",
        button: "Logout & Relax",
      };
    }

    return {
      title: `Goodbye, ${firstName}! 👋`,
      message:
        "You've wrapped up another productive week. Enjoy your weekend, relax, and come back refreshed. We'll see you on Monday!",
      button: "Start My Weekend",
    };
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

  // Notification
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <>
      <header className="navbar">
        {/* =======================
              Logo
        ======================= */}

        <div
          className="navbar_logo"
          id="tour-logo"
        >
          <NavLink to="/">
            <div className="logo_text">
              <img
                src={
                  resolvedTheme === "dark" ? "/Logo_N.svg" : "/Logo_N_Light.svg"
                }
                alt="Logo"
              />
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

              {unreadCount > 0 && (
                <span className="notification_count">{unreadCount}</span>
              )}
            </button>

            {notificationOpen && (
              <div className="notification_dropdown">
                <h4>Notifications</h4>

                {loading ? (
                  <div className="notification_item">Loading...</div>
                ) : notifications.length === 0 ? (
                  <div className="notification_item">
                    No notifications found.
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`notification_item ${
                        !notification.read ? "unread" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <strong>{notification.title}</strong>

                      <p>{notification.message}</p>
                    </div>
                  ))
                )}

                <button
                  className="view_all_btn"
                  onClick={() => {
                    setNotificationOpen(false);
                    navigate("/notifications");
                  }}
                >
                  View All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile */}

        <div
          className="profile_container"
          id="tour-profile"
          ref={profileRef}
        >
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
                  ? `${user.firstName?.charAt(0).toUpperCase()}${user.firstName?.slice(
                      1,
                    )} ${user.lastName?.charAt(0).toUpperCase()}${user.lastName?.slice(
                      1,
                    )}`
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
              <NavLink
                to="/employee"
                onClick={() => setProfileOpen(false)}
              >
                My Profile
              </NavLink>

              <NavLink
                to="/settings"
                onClick={() => setProfileOpen(false)}
              >
                Settings
              </NavLink>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  setLogoutOpen(true);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}

        <button
          id="tour-mobile-btn"
          className="mobile_btn"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      <Feedback
        isOpen={logoutOpen}
        variant="logout"
        title={getLogoutContent().title}
        message={getLogoutContent().message}
        confirmText={getLogoutContent().button}
        cancelText="Stay Logged In"
        onClose={() => setLogoutOpen(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
}
