import '../styles/AdminDashboard.css';
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
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { AdminProfile } from '../components/Dashboard/Dropdowns/AdminProfileDropdown/AdminProfileDropdown';

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
      color: '#FFF',
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
              <div className="notificaton-div">
                <FaBell style={{ fontSize: '18px' }} />
              </div>
              <div className="admin-profile">
                <AdminProfile />
              </div>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
}
