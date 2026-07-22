import "./SettingSidebar.css";

import { NavLink } from "react-router-dom";

import { FaRegUser } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { MdNotifications } from "react-icons/md";
import { RiPaletteLine } from "react-icons/ri";
import { FaLock } from "react-icons/fa";
import { GoDatabase } from "react-icons/go";
import { MdOutlineContactSupport } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";

export const SettingSidebar = () => {
  return (
    <>
      <div className="settingSidebar-container">
        <div className="settingSidebar-content">
          <div className="settingSidebar-logo">
            <img
              src="/Logo_N.svg"
              alt="logo"
            />
          </div>
          <div className="settingSidebar-list">
            <p className="settings-heading">SETTINGS</p>
            <div className="settingSidebar-list-content">
              <NavLink
                to="profile"
                className="settingSidebar-profile settingSidebar-link"
              >
                <FaRegUser className="settingSidebar-icon" />
                <span>Profile</span>
              </NavLink>
              <NavLink
                to="attendance"
                className="attendance settingSidebar-link"
              >
                <MdOutlineWatchLater className="settingSidebar-icon" />
                <span>Attendance</span>
              </NavLink>
              <NavLink
                to="calendar"
                className="settingSidebar-link"
              >
                <FaCalendarAlt className="settingSidebar-icon" />
                <span>Calendar</span>
              </NavLink>
              <NavLink
                to="notification"
                className="notifications settingSidebar-link"
              >
                <MdNotifications className="settingSidebar-icon" />
                <span>Notifications</span>
              </NavLink>
              <NavLink
                to="appearance"
                className="appearance settingSidebar-link"
              >
                <RiPaletteLine className="settingSidebar-icon" />
                <span>Appearance</span>
              </NavLink>
              <NavLink
                to="security"
                className="security settingSidebar-link"
              >
                <FaLock className="settingSidebar-icon" />
                <span>Security</span>
              </NavLink>
              <NavLink
                to="data_export"
                className="dataExport settingSidebar-link"
              >
                <GoDatabase className="settingSidebar-icon" />
                <span>Data & Exoport</span>
              </NavLink>
              <NavLink
                to="help_support"
                className="helpSupport settingSidebar-link"
              >
                <MdOutlineContactSupport className="settingSidebar-icon" />
                <span>Help & Support</span>
              </NavLink>
            </div>
          </div>
          <div className="settingSidebar-userProfile">
            <div className="userProfile-img">
              
            </div>
            <div className="user_details">
              <p>Silent Killer</p>
              <p>email@.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
