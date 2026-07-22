import "../styles/Setting.css"
import { SettingSidebar } from "../components/Setting/SettingSidebar/SettingSidebar";

import { useLocation, Outlet } from "react-router-dom";

import { FaRegUser } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { MdNotifications } from "react-icons/md";
import { RiPaletteLine } from "react-icons/ri";
import { FaLock } from "react-icons/fa";
import { GoDatabase } from "react-icons/go";
import { MdOutlineContactSupport } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";

export const Settings = () => {
  const location = useLocation();

  const pageData = {
    "/settings/profile": {
      title: "Profile",
      icon: <FaRegUser />,
    },
    "/settings/attendance": {
      title: "Attendance",
      icon: <MdOutlineWatchLater />,
    },
    "/settings/calendar": {
      title: "Calendar",
      icon: <FaCalendarAlt />,
    },
    "/settings/notification": {
      title: "Notifications",
      icon: <MdNotifications />,
    },
    "/settings/appearance": {
      title: "Appearance",
      icon: <RiPaletteLine />,
    },
    "/settings/security": {
      title: "Security",
      icon: <FaLock />,
    },
    "/settings/data_export": {
      title: "Data & Export",
      icon: <GoDatabase />,
    },
    "/settings/help_support": {
      title: "Help & Support",
      icon: <MdOutlineContactSupport />,
    },
  };

  const currentPage =
    pageData[location.pathname] || pageData["/settings/profile"];

  return (
    <>
      <div className="setting-page-container">
        <SettingSidebar />
        <div className="setting-page-content">
          <div className="content-heading">
            <span>{currentPage.icon}</span>
            <h4>{currentPage.title}</h4>
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
};
