import '../styles/Dashboard.css';
import { Outlet, useLocation } from 'react-router-dom';
import { DashboardSidebar } from '../components/Dashboard/DashboardSidebar/DashboardSidebar';
import { MdEventAvailable, MdOutlineSpaceDashboard, MdOutlineWatchLater } from 'react-icons/md';
import {
  FaUsers,
  FaCalendarDays,
  FaLightbulb,
  FaBell,
  FaBullhorn,
  FaChartBar,
  FaGear,
} from 'react-icons/fa6';

import { FaSearch } from 'react-icons/fa';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';

export default function AdminDashboard() {
  const location = useLocation();

  const headerData = {
    '/adminDashboard/home': {
      title: 'Dashboard',
      icon: <MdOutlineSpaceDashboard />,
      color: '#fff',
    },
    '/adminDashboard/employee': {
      title: 'Employees',
      icon: <FaUsers />,
      color: '#583790',
    },
    '/adminDashboard/attendance': {
      title: 'Attendance',
      icon: <MdOutlineWatchLater />,
      color: '#60A5FA',
    },
    '/adminDashboard/leave': {
      title: 'Leave',
      icon: <MdEventAvailable />,
      color: '#FB7185',
    },
    '/adminDashboard/calendar': {
      title: 'Calendar',
      icon: <FaCalendarDays />,
      color: '#38BDF8',
    },
    '/adminDashboard/thought': {
      title: 'Thoughts',
      icon: <FaLightbulb />,
      color: '#ffc844',
    },
    '/adminDashboard/notification': {
      title: 'Notifications',
      icon: <FaBell />,
      color: '#ef9b52',
    },
    '/adminDashboard/announcement': {
      title: 'Announcements',
      icon: <FaBullhorn />,
      color: '#d13673',
    },
    '/adminDashboard/report': {
      title: 'Reports & Analytics',
      icon: <FaChartBar />,
      color: '#c9d7ba',
    },
    '/adminDashboard/setting': {
      title: 'Settings',
      icon: <FaGear />,
      color: '#fff',
    },
  };

  const currentPage =
    headerData[location.pathname] || headerData['/adminDashboard/home'];

  return (
    <>
      <div className="dashboard-container">
        <DashboardSidebar />
        <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="dashboard-heading">
              <span style={{ color: currentPage.color }}>
                {currentPage.icon}
              </span>
              <span>{currentPage.title}</span>
            </div>
            <div className="header-right">
              <div className="dashboard-search">
                <FaSearch style={{ color: '#579cbd' }} />
                <input type="search" placeholder="Search employee..." />
              </div>
              <div className="notificaton-div">
                <FaBell style={{ color: '#ef9b52', fontSize: '18px' }} />
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
                  <IoMdArrowDropup style={{ display: 'none' }} />
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
