import { NavLink } from 'react-router-dom';

import "../Dashboard/DashboardSidebar.css";
import "../../styles/global.css"

import { MdOutlineSpaceDashboard } from "react-icons/md";
import { IoIosArrowRoundBack } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import {
  FaUsers,
  FaCalendarDays,
  FaLightbulb,
  FaBell,
  FaBullhorn,
  FaChartBar,
  FaGear,
} from "react-icons/fa6";

export const DashboardSidebar = () => {


    return (
        <>
            <div className="dashboardSidebar-container">
                <div className="dashboard-logo">
                    <img src="/Logo_N.svg" alt="logo" />
                </div>
                <div className="dashboardSidebar-list">
                    <NavLink to="home" className="dashboard-home dashboard-navlink">
                        <MdOutlineSpaceDashboard />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="employee" className="dashboard-employees dashboard-navlink">
                        <FaUsers style={{color: "#583790"}} />
                        <span>Employees</span>
                    </NavLink>
                    <NavLink to="attendance" className="dashboard-attendance dashboard-navlink">
                        <FaCalendarDays style={{color: "#c8dcff"}} />
                        <span>Attendance</span>
                    </NavLink>
                    <NavLink to="thought" className="dashboard-thoughts dashboard-navlink">
                        <FaLightbulb style={{color: "#ffc844"}} />
                        <span>Thoughts</span>
                    </NavLink>
                    <NavLink to="notification" className="dashboard-notification dashboard-navlink">
                        <FaBell style={{color: "#ef9b52"}} />
                        <span>Notifications</span>
                    </NavLink>
                    <NavLink to="announcement" className="dashboard-announcement dashboard-navlink">
                        <FaBullhorn  style={{color: "#d13673"}} />
                        <span>Announcements</span>
                    </NavLink>
                    <NavLink to="report" className="dashboard-report dashboard-navlink">
                        <FaChartBar  style={{color: "#c9d7ba"}} />
                        <span>Reports & Analytics</span>
                    </NavLink>
                    <NavLink to="setting" className="dashboard-setting dashboard-navlink">
                        <FaGear />
                        <span>Settings</span>
                    </NavLink>
                </div>
                <div className="dashboard-logout">
                    <div className='collapse'>
                        <IoIosArrowRoundBack />
                        <span>Collapse</span>
                    </div>
                    <div className='logout-div'>
                        <AiOutlineLogout />
                        <span>Logout</span>
                    </div>
                </div>
            </div>
        </>
    )
}