import "../styles/Dashboard.css";


import { Outlet, useLocation } from "react-router-dom";
import { DashboardSidebar } from "../components/Dashboard/DashboardSidebar/DashboardSidebar";

import { MdOutlineSpaceDashboard } from "react-icons/md";
import {
  FaUsers,
  FaCalendarDays,
  FaLightbulb,
  FaBell,
  FaBullhorn,
  FaChartBar,
  FaGear,
} from "react-icons/fa6";

import { FaSearch } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";


export default function AdminDashboard() {
  const location = useLocation();

  const headerData = {
    "/dashboard/home": {
      title: "Dashboard",
      icon: <MdOutlineSpaceDashboard />,
      color: "#fff"
    },
    "/dashboard/employee": {
      title: "Employees",
      icon: <FaUsers />,
      color: "#583790"
    },
    "/dashboard/attendance": {
      title: "Attendance",
      icon: <FaCalendarDays />,
      color: "#c8dcff"
    },
    "/dashboard/thought": {
      title: "Thoughts",
      icon: <FaLightbulb />,
      color: "#ffc844"
    },
    "/dashboard/notification": {
      title: "Notifications",
      icon: <FaBell />,
      color: "#ef9b52"
    },
    "/dashboard/announcement": {
      title: "Announcements",
      icon: <FaBullhorn />,
      color: "#d13673"
    },
    "/dashboard/report": {
      title: "Reports & Analytics",
      icon: <FaChartBar />,
      color: "#c9d7ba"
    },
    "/dashboard/setting": {
      title: "Settings",
      icon: <FaGear />,
      color: "#fff"
    },
  };

  const currentPage =
    headerData[location.pathname] || headerData["/dashboard/home"];

  return (
    <>
      <div className="dashboard-container">
        <DashboardSidebar />
        <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="dashboard-heading">
              <span style={{color: currentPage.color}}>{currentPage.icon}</span>
              <span>{currentPage.title}</span>
            </div>
            <div className="header-right">
              <div className="dashboard-search">
                <FaSearch style={{color: "#579cbd"}} />
                <input type="search" placeholder="Search employee..." />
              </div>
              <div className="notificaton-div">
                <FaBell style={{ color: "#ef9b52", "fontSize": "18px" }} />
              </div>
              <div className="admin-profile">
                <div className="admin-avatar">
                  {/* <img
                    src=""
                    alt=""
                  /> */}
                  <span>SK</span>
                </div>
                <div className="admin-content">
                  <span>Admin</span>
                  <p>Super Admin</p>
                </div>
                <div>
                  <IoMdArrowDropdown />
                  <IoMdArrowDropup style={{display: "none"}} />
                </div>
              </div>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
}
