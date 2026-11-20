import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import "./SettingSidebar.css";
import { FaUser } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { MdNotifications } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { GoDatabase } from "react-icons/go";
import { MdOutlineContactSupport } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import { TbColorFilter } from "react-icons/tb";

export const SettingSidebar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <div className="settingSidebar-container">
        <div className="settingSidebar-content">
          <div className="settingSidebar-list">
            <p className="settings-heading">SETTINGS</p>
            <div className="settingSidebar-list-content">
              <NavLink
                to="profile"
                className="settingSidebar-profile settingSidebar-link"
              >
                <FaUser style={{ color: "#583790" }} className="settingSidebar-icon" />
                <span>Profile</span>
              </NavLink>
              <NavLink
                to="attendance"
                className="attendance settingSidebar-link"
              >
                <MdOutlineWatchLater className="settingSidebar-icon" style={{ color: "#60A5FA"}} />
                <span>Attendance</span>
              </NavLink>

              <NavLink
                to="appearance"
                className="appearance settingSidebar-link"
              >
                <TbColorFilter className="settingSidebar-icon" style={{ color: "#60A5FA"}} />
                <span>Appearance</span>
              </NavLink>

              <NavLink
                to="leave"
                className="settingSidebar-link"
              >
                <MdEventAvailable className="settingSidebar-icon" style={{ color: "#FB7185" }} />
                <span>Leave</span>
              </NavLink>

              <NavLink
                to="calendar"
                className="settingSidebar-link"
              >
                <FaCalendarAlt className="settingSidebar-icon" style={{ color: "#38BDF8" }} />
                <span>Calendar</span>
              </NavLink>
              <NavLink
                to="notification"
                className="notifications settingSidebar-link"
              >
                <MdNotifications className="settingSidebar-icon" style={{ color: "#ef9b52", fontSize: "19px" }} />
                <span>Notifications</span>
              </NavLink>
              <NavLink
                to="security"
                className="security settingSidebar-link"
              >
                <FaLock className="settingSidebar-icon" style={{ color: "#60A5FA" }} />
                <span>Security</span>
              </NavLink>
              <NavLink
                to="data_export"
                className="dataExport settingSidebar-link"
              >
                <GoDatabase className="settingSidebar-icon" style={{ color: "#c9d7ba" }} />
                <span>Data & Exoport</span>
              </NavLink>
              <NavLink
                to="help_support"
                className="helpSupport settingSidebar-link"
              >
                <MdOutlineContactSupport className="settingSidebar-icon" style={{ color: "#38BDF8" }} />
                <span>Help & Support</span>
              </NavLink>
            </div>
          </div>
          <div className="settingSidebar-userProfile">
            <div className="userProfile-img">
              {user
                ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
                : "U"}
            </div>
            <div className="user_details">
              <p>
                {user
                  ? `${user.firstName
                    ?.charAt(0)
                    .toUpperCase()}${user.firstName?.slice(1)} ${user.lastName?.charAt(0).toUpperCase() +
                  user.lastName?.slice(1)
                  }`
                  : "User"}
              </p>
              <p>{user?.email ?? "No email available"}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
