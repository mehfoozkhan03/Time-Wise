import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaBell, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";

import { markNotificationAsRead } from "../../services/notificationServices";
import "./Navbar.css";
import { logout } from "../../store/authSlice";
import { authService } from "../../services/authService";
// import { useTheme } from "../../context/ThemeContext";
import { fetchNotifications } from ".././../store/notificationSlice";
import { Modal } from "../Modal/Modal";
import { checkOut, endBreak, getTodayAttendance } from "../../store/attendanceSlice";

export default function Navbar() {
  const { notifications, loading } = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await markNotificationAsRead(notification._id);

        dispatch(
          fetchNotifications({
            page: 1,
            limit: 5,
          }),
        );
      }

      setNotificationOpen(false);

      if (notification.referenceModel === "Post" && notification.referenceId) {
        navigate(`/community/post/${notification.referenceId}`);
      }
    } catch (error) {
      console.error("Notification Click Error:", error);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  //# Theme
  const currentTheme = useSelector((state) => state.theme.theme);

  const resolvedTheme =
    currentTheme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : currentTheme;

  const isHome = location.pathname === "/";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [overProfileBanner, setOverProfileBanner] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutLegacyOpen, setLogoutLegacyOpen] = useState(false);
  const [logoutWithCheckout, setLogoutWithCheckout] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [checkingAttendance, setCheckingAttendance] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const confirmLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    setLogoutError("");

    try {
      if (logoutWithCheckout) {
        const todayResponse = await dispatch(getTodayAttendance()).unwrap();
        const attendance = todayResponse?.attendance;

        if (attendance?.checkInTime && !attendance.checkOutTime) {
          const breaks = attendance.breaks || [];
          const currentBreak = breaks[breaks.length - 1];

          if (currentBreak?.breakStart && !currentBreak.breakEnd) {
            await dispatch(endBreak()).unwrap();
          }

          await dispatch(checkOut()).unwrap();
        }
      }

      await authService.logout();
      dispatch(logout());
      setLogoutOpen(false);
      setLogoutLegacyOpen(false);
      navigate("/login");
    } catch (error) {
      setLogoutError(
        typeof error === "string"
          ? error
          : error.response?.data?.message || "Unable to log out. Please try again.",
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  const firstName =
    user?.firstName?.charAt(0).toUpperCase() + user?.firstName?.slice(1) ||
    "User";

  const getLogoutContent = () => {
    const today = new Date().getDay();
    return {
      title: `Goodbye, ${firstName}! 👋`,
      message: today >= 1 && today <= 4
        ? "That's a wrap for today! Great work. Take some time to relax and recharge — we'll be ready for another productive day tomorrow."
        : "You've wrapped up another productive week. Enjoy your weekend, relax, and come back refreshed. We'll see you on Monday!",
      button: today >= 1 && today <= 4 ? "Logout & Relax" : "Start My Weekend",
    };
  };

  const openLogoutPrompt = async () => {
    setProfileOpen(false);
    setLogoutOpen(false);
    setLogoutLegacyOpen(false);
    setLogoutWithCheckout(false);
    setLogoutError("");
    setCheckingAttendance(true);

    try {
      const todayResponse = await dispatch(getTodayAttendance()).unwrap();
      const attendance = todayResponse?.attendance;
      const isCheckedIn = Boolean(attendance?.checkInTime && !attendance.checkOutTime);

      setLogoutOpen(isCheckedIn);
      setLogoutLegacyOpen(!isCheckedIn);
    } catch (error) {
      setLogoutError(
        typeof error === "string"
          ? error
          : error.response?.data?.message || "Unable to check today's attendance. Choose how to log out.",
      );
      setLogoutOpen(true);
      setLogoutLegacyOpen(false);
    } finally {
      setCheckingAttendance(false);
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

  useEffect(() => {
    const handleScroll = () => {
      const banner = document.querySelector(".profile_banner");
      const navbar = document.querySelector(".navbar");

      if (!banner || !navbar) {
        setOverProfileBanner(false);
        return;
      }

      const bannerRect = banner.getBoundingClientRect();
      const navbarHeight = navbar.offsetHeight;

      const isOverBanner =
        bannerRect.top <= navbarHeight && bannerRect.bottom >= 0;

      setOverProfileBanner(isOverBanner);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  // Notification
  useEffect(() => {
    dispatch(
      fetchNotifications({
        page: 1,
        limit: 5,
      }),
    );
  }, [dispatch]);

  return (
    <>
      <header
        className={`navbar ${overProfileBanner ? "navbar_over_banner" : ""}`}
      >
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

                <span>{user?.designation}</span>
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
                  onClick={openLogoutPrompt}
                  disabled={checkingAttendance || logoutLoading}
                >
                  {checkingAttendance ? "Checking attendance..." : "Logout"}
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
        </div>
      </header>

      <Modal
        isOpen={logoutOpen}
        onClose={() => {
          if (!logoutLoading) setLogoutOpen(false);
        }}
        onOverlayClick={() => {
          if (!logoutLoading) setLogoutOpen(false);
        }}
        onContentClick={(event) => event.stopPropagation()}
      >
        <div className="logout_choice_content">
          <div className="feedback_icon feedback_icon--logout">
            <span className="feedback_wave" role="img" aria-label="Goodbye">👋</span>
          </div>
          <h2 className="feedback_title">Log out, {firstName}?</h2>
          <p className="feedback_message">Choose how to finish your attendance before logging out.</p>

          <fieldset className="logout_attendance_options" disabled={logoutLoading}>
            <legend>Attendance</legend>
            <label className="logout_attendance_choice">
              <input
                type="radio"
                name="logout-attendance"
                checked={!logoutWithCheckout}
                onChange={() => setLogoutWithCheckout(false)}
              />
              <span>
                <strong>Without checkout</strong>
                <small>Log out without recording a check-out.</small>
              </span>
            </label>
            <label className="logout_attendance_choice">
              <input
                type="radio"
                name="logout-attendance"
                checked={logoutWithCheckout}
                onChange={() => setLogoutWithCheckout(true)}
              />
              <span>
                <strong>With checkout</strong>
                <small>Check out automatically, then log out.</small>
              </span>
            </label>
          </fieldset>

          {logoutError && <p className="logout_choice_error" role="alert">{logoutError}</p>}

          <div className="feedback_actions">
            <button
              className="feedback_button feedback_button--cancel"
              type="button"
              disabled={logoutLoading}
              onClick={() => setLogoutOpen(false)}
            >
              Stay Logged In
            </button>
            <button
              className="feedback_button feedback_button--logout"
              type="button"
              disabled={logoutLoading}
              onClick={confirmLogout}
            >
              {logoutLoading
                ? logoutWithCheckout
                  ? "Checking out..."
                  : "Logging out..."
                : "Log Out"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={logoutLegacyOpen}
        variant="logout"
        title={getLogoutContent().title}
        message={logoutError || getLogoutContent().message}
        confirmText={logoutLoading ? "Logging out..." : getLogoutContent().button}
        cancelText="Stay Logged In"
        onClose={() => {
          if (!logoutLoading) {
            setLogoutLegacyOpen(false);
            setLogoutError("");
          }
        }}
        onConfirm={confirmLogout}
      />

    </>
  );
}
