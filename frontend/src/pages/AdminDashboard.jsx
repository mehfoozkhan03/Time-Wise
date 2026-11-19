import "../styles/AdminDashboard.css";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Skeleton from "../components/Skeleton/Skeleton";

import { DashboardSidebar } from "../components/Dashboard/DashboardSidebar/DashboardSidebar";
import { AdminProfile } from "../components/Dashboard/Dropdowns/AdminProfileDropdown/AdminProfileDropdown";

import BirthdayCelebration from "../components/EventCalendar/BirthdayCelebration/BirthdayCelebration";

import {
  MdEventAvailable,
  MdOutlineSpaceDashboard,
  MdOutlineWatchLater,
} from "react-icons/md";

import {
  FaUsers,
  FaCalendarDays,
  FaLightbulb,
  FaBell,
  FaBullhorn,
  FaChartBar,
  FaGear,
} from "react-icons/fa6";
import { TbColorFilter } from "react-icons/tb";

export default function AdminDashboard() {
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/+$/, "") || "/adminDashboard";
  const isCalendarPage = normalizedPath.endsWith("/calendar");
  const [showPageSkeleton, setShowPageSkeleton] = useState(!isCalendarPage);

  useEffect(() => {
    if (isCalendarPage) {
      setShowPageSkeleton(false);
      return undefined;
    }

    setShowPageSkeleton(true);
    const timer = window.setTimeout(() => setShowPageSkeleton(false), 650);
    return () => window.clearTimeout(timer);
  }, [normalizedPath, isCalendarPage]);

  const headerData = {
    "/adminDashboard": {
      title: "Dashboard",
      icon: <MdOutlineSpaceDashboard />,
      color: "#fff",
    },
    "/adminDashboard/adminDashboard": {
      title: "Dashboard",
      icon: <MdOutlineSpaceDashboard />,
      color: "#fff",
    },
    "/adminDashboard/home": {
      title: "Dashboard",
      icon: <MdOutlineSpaceDashboard />,
      color: "#fff",
    },
    "/adminDashboard/employee": {
      title: "Employees",
      icon: <FaUsers />,
      color: "#583790",
    },
    "/adminDashboard/attendance": {
      title: "Attendance",
      icon: <MdOutlineWatchLater />,
      color: "#60A5FA",
    },
    "/adminDashboard/appearence": {
      title: "Appearance",
      icon: <TbColorFilter />,
      color: "#60A5FA",
    },
    "/adminDashboard/leave": {
      title: "Leave",
      icon: <MdEventAvailable />,
      color: "#FB7185",
    },
    "/adminDashboard/calendar": {
      title: "Calendar",
      icon: <FaCalendarDays />,
      color: "#38BDF8",
    },
    "/adminDashboard/thought": {
      title: "Thoughts",
      icon: <FaLightbulb />,
      color: "#ffc844",
    },
    "/adminDashboard/notification": {
      title: "Notifications",
      icon: <FaBell />,
      color: "#FFF",
    },
    "/adminDashboard/announcement": {
      title: "Announcements",
      icon: <FaBullhorn />,
      color: "#d13673",
    },
    "/adminDashboard/report": {
      title: "Reports & Analytics",
      icon: <FaChartBar />,
      color: "#c9d7ba",
    },
    "/adminDashboard/setting": {
      title: "Settings",
      icon: <FaGear />,
      color: "#fff",
    },
  };

  const currentPage =
    headerData[normalizedPath] || headerData["/adminDashboard"];

  const renderHomeSkeleton = () => (
    <div className="admin-page-loading is-home">
      <div className="admin-page-loading-home-stats">
        {[1, 2, 3, 4, 5].map((i) => (
          <div className="admin-page-loading-card" key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Skeleton width="40px" height="40px" radius="10px" />
              <Skeleton width="45px" height="16px" radius="10px" />
            </div>
            <Skeleton width="45%" height="26px" radius="6px" />
            <Skeleton width="70%" height="14px" radius="4px" />
            <Skeleton width="55%" height="12px" radius="4px" />
          </div>
        ))}
      </div>

      <div className="admin-page-loading-home-main">
        <div className="admin-page-loading-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Skeleton width="180px" height="22px" radius="6px" />
            <div style={{ display: "flex", gap: 10 }}>
              <Skeleton width="70px" height="18px" radius="10px" />
              <Skeleton width="70px" height="18px" radius="10px" />
            </div>
          </div>
          <Skeleton width="100%" height="250px" radius="12px" />
        </div>

        <div className="admin-page-loading-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <Skeleton width="150px" height="22px" radius="6px" />
            <Skeleton width="60px" height="16px" radius="10px" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
              <Skeleton width="38px" height="38px" radius="50%" />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <Skeleton width="65%" height="15px" radius="4px" />
                <Skeleton width="40%" height="12px" radius="4px" />
              </div>
              <Skeleton width="65px" height="22px" radius="12px" />
            </div>
          ))}
        </div>
      </div>

      <div className="admin-page-loading-home-actions">
        {[1, 2, 3].map((i) => (
          <div key={i} className="admin-page-loading-card" style={{ flex: 1, minWidth: "180px", flexDirection: "row", alignItems: "center", gap: 12, padding: "14px 18px" }}>
            <Skeleton width="36px" height="36px" radius="8px" />
            <Skeleton width="130px" height="16px" radius="4px" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmployeeSkeleton = () => (
    <div className="admin-page-loading">
      <div className="admin-page-loading-title">
        <div>
          <Skeleton width="220px" height="26px" radius="6px" />
          <div style={{ marginTop: 6 }}>
            <Skeleton width="280px" height="14px" radius="4px" />
          </div>
        </div>
        <Skeleton width="140px" height="40px" radius="10px" />
      </div>

      <div className="admin-page-loading-cards" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        {[1, 2, 3].map((i) => (
          <div className="admin-page-loading-card" key={i}>
            <Skeleton width="38px" height="38px" radius="10px" />
            <Skeleton width="40%" height="26px" radius="6px" />
            <Skeleton width="60%" height="14px" radius="4px" />
          </div>
        ))}
      </div>

      <div className="admin-page-loading-panel admin-page-loading-table">
        <div className="admin-page-loading-toolbar">
          <Skeleton width="240px" height="38px" radius="8px" />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Skeleton width="120px" height="38px" radius="8px" />
            <Skeleton width="130px" height="38px" radius="8px" />
            <Skeleton width="100px" height="38px" radius="8px" />
          </div>
        </div>
        <Skeleton width="100%" height="40px" radius="6px" />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 12px" }}>
            <Skeleton width="34px" height="34px" radius="50%" />
            <Skeleton width="22%" height="16px" radius="4px" />
            <Skeleton width="14%" height="20px" radius="10px" />
            <Skeleton width="18%" height="15px" radius="4px" />
            <Skeleton width="18%" height="15px" radius="4px" />
            <Skeleton width="10%" height="20px" radius="10px" />
            <Skeleton width="8%" height="28px" radius="6px" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderAttendanceSkeleton = () => (
    <div className="admin-page-loading">
      <div className="admin-page-loading-title">
        <div>
          <Skeleton width="220px" height="26px" radius="6px" />
          <div style={{ marginTop: 6 }}>
            <Skeleton width="190px" height="15px" radius="4px" />
          </div>
        </div>
        <Skeleton width="130px" height="36px" radius="8px" />
      </div>

      <div className="admin-page-loading-panel admin-page-loading-table">
        <Skeleton width="100%" height="42px" radius="8px" />
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 14px" }}>
            <Skeleton width="34px" height="34px" radius="50%" />
            <div style={{ width: "22%", display: "flex", flexDirection: "column", gap: 5 }}>
              <Skeleton width="75%" height="15px" radius="4px" />
              <Skeleton width="50%" height="12px" radius="4px" />
            </div>
            <Skeleton width="14%" height="16px" radius="4px" />
            <Skeleton width="14%" height="16px" radius="4px" />
            <Skeleton width="14%" height="16px" radius="4px" />
            <Skeleton width="14%" height="16px" radius="4px" />
            <Skeleton width="12%" height="24px" radius="12px" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppearanceSkeleton = () => (
    <div className="admin-page-loading">
      <div className="admin-page-loading-panel" style={{ gap: 24 }}>
        <div>
          <Skeleton width="180px" height="26px" radius="6px" />
          <div style={{ marginTop: 8 }}>
            <Skeleton width="min(440px, 90%)" height="15px" radius="4px" />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Skeleton width="120px" height="20px" radius="4px" />
          <div className="admin-page-loading-themes">
            {[1, 2, 3].map((i) => (
              <div key={i} className="admin-page-loading-card" style={{ height: "150px", justifyContent: "center", alignItems: "center", gap: 14 }}>
                <Skeleton width="44px" height="44px" radius="12px" />
                <Skeleton width="80px" height="18px" radius="6px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLeaveSkeleton = () => (
    <div className="admin-page-loading">
      <div className="admin-page-loading-cards">
        {[1, 2, 3, 4].map((i) => (
          <div className="admin-page-loading-card" key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Skeleton width="36px" height="36px" radius="10px" />
              <Skeleton width="45px" height="16px" radius="8px" />
            </div>
            <Skeleton width="40%" height="26px" radius="6px" />
            <Skeleton width="65%" height="14px" radius="4px" />
          </div>
        ))}
      </div>

      <div className="admin-page-loading-panel admin-page-loading-table">
        <div className="admin-page-loading-toolbar">
          <Skeleton width="220px" height="38px" radius="8px" />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} width="80px" height="34px" radius="8px" />
            ))}
          </div>
        </div>
        <Skeleton width="100%" height="42px" radius="8px" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px" }}>
            <Skeleton width="32px" height="32px" radius="50%" />
            <Skeleton width="20%" height="16px" radius="4px" />
            <Skeleton width="14%" height="22px" radius="10px" />
            <Skeleton width="16%" height="15px" radius="4px" />
            <Skeleton width="24%" height="15px" radius="4px" />
            <Skeleton width="12%" height="22px" radius="10px" />
            <Skeleton width="10%" height="28px" radius="6px" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderThoughtSkeleton = () => (
    <div className="admin-page-loading">
      <div className="admin-page-loading-title">
        <div>
          <Skeleton width="200px" height="26px" radius="6px" />
          <div style={{ marginTop: 6 }}>
            <Skeleton width="280px" height="14px" radius="4px" />
          </div>
        </div>
        <Skeleton width="140px" height="38px" radius="8px" />
      </div>

      <div className="admin-page-loading-panel" style={{ minHeight: "auto", padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Skeleton width="40px" height="40px" radius="50%" />
          <Skeleton width="100%" height="42px" radius="10px" />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="admin-page-loading-panel" style={{ minHeight: "auto", padding: 18, gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Skeleton width="44px" height="44px" radius="50%" />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Skeleton width="140px" height="16px" radius="4px" />
                  <Skeleton width="180px" height="12px" radius="4px" />
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Skeleton width="60px" height="26px" radius="8px" />
                <Skeleton width="28px" height="26px" radius="8px" />
              </div>
            </div>
            <Skeleton width="90%" height="15px" radius="4px" />
            <Skeleton width="75%" height="15px" radius="4px" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotificationSkeleton = () => (
    <div className="admin-page-loading admin-page-loading-two-col">
      <div className="admin-page-loading-panel" style={{ gap: 16 }}>
        <Skeleton width="180px" height="22px" radius="6px" />
        <Skeleton width="100%" height="40px" radius="8px" />
        <Skeleton width="100%" height="40px" radius="8px" />
        <Skeleton width="100%" height="110px" radius="8px" />
        <Skeleton width="140px" height="42px" radius="8px" />
      </div>

      <div className="admin-page-loading-panel" style={{ gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <Skeleton width="180px" height="22px" radius="6px" />
          <Skeleton width="65px" height="20px" radius="10px" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
            <Skeleton width="38px" height="38px" radius="10px" />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <Skeleton width="85%" height="15px" radius="4px" />
              <Skeleton width="35%" height="12px" radius="4px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnnouncementSkeleton = () => (
    <div className="admin-page-loading">
      <div className="admin-page-loading-title">
        <div>
          <Skeleton width="240px" height="26px" radius="6px" />
          <div style={{ marginTop: 6 }}>
            <Skeleton width="300px" height="14px" radius="4px" />
          </div>
        </div>
        <Skeleton width="170px" height="40px" radius="10px" />
      </div>

      <div className="admin-page-loading-cards">
        {[1, 2, 3, 4].map((i) => (
          <div className="admin-page-loading-card" key={i}>
            <Skeleton width="34px" height="34px" radius="8px" />
            <Skeleton width="40%" height="24px" radius="6px" />
            <Skeleton width="60%" height="13px" radius="4px" />
          </div>
        ))}
      </div>

      <div className="admin-page-loading-toolbar">
        <Skeleton width="220px" height="38px" radius="8px" />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Skeleton width="130px" height="38px" radius="8px" />
          <Skeleton width="120px" height="38px" radius="8px" />
          <Skeleton width="110px" height="38px" radius="8px" />
        </div>
      </div>

      <div className="admin-page-loading-announcements">
        {[1, 2, 3].map((i) => (
          <div key={i} className="admin-page-loading-panel" style={{ minHeight: "auto", padding: 18, gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Skeleton width="80px" height="22px" radius="10px" />
              <Skeleton width="60px" height="22px" radius="10px" />
            </div>
            <Skeleton width="75%" height="20px" radius="6px" />
            <Skeleton width="45%" height="13px" radius="4px" />
            <Skeleton width="100%" height="50px" radius="6px" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderReportSkeleton = () => (
    <div className="admin-page-loading">
      <div className="admin-page-loading-title">
        <div>
          <Skeleton width="220px" height="26px" radius="6px" />
          <div style={{ marginTop: 6 }}>
            <Skeleton width="320px" height="14px" radius="4px" />
          </div>
        </div>
      </div>

      <div className="admin-page-loading-home-main">
        <div className="admin-page-loading-panel">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <Skeleton width="24px" height="24px" radius="6px" />
            <Skeleton width="200px" height="20px" radius="4px" />
          </div>
          <Skeleton width="100%" height="250px" radius="10px" />
        </div>

        <div className="admin-page-loading-panel">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <Skeleton width="24px" height="24px" radius="6px" />
            <Skeleton width="180px" height="20px" radius="4px" />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "180px" }}>
            <Skeleton width="140px" height="140px" radius="50%" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                <Skeleton width="80px" height="14px" radius="4px" />
                <Skeleton width="35px" height="14px" radius="4px" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-page-loading-panel">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <Skeleton width="24px" height="24px" radius="6px" />
          <Skeleton width="220px" height="20px" radius="4px" />
        </div>
        <Skeleton width="100%" height="240px" radius="10px" />
      </div>
    </div>
  );

  const renderSettingSkeleton = () => (
    <div className="admin-page-loading admin-page-loading-settings">
      <div className="admin-page-loading-panel" style={{ gap: 16 }}>
        <Skeleton width="180px" height="22px" radius="6px" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Skeleton width="110px" height="12px" radius="4px" />
            <Skeleton width="100%" height="38px" radius="8px" />
          </div>
        ))}
        <Skeleton width="130px" height="38px" radius="8px" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="admin-page-loading-panel" style={{ gap: 16 }}>
          <Skeleton width="160px" height="22px" radius="6px" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Skeleton width="130px" height="16px" radius="4px" />
            <Skeleton width="50px" height="26px" radius="14px" />
          </div>
          <Skeleton width="70%" height="14px" radius="4px" />
          <Skeleton width="150px" height="38px" radius="8px" />
        </div>

        <div className="admin-page-loading-panel" style={{ gap: 14 }}>
          <Skeleton width="200px" height="22px" radius="6px" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
              <Skeleton width="60%" height="15px" radius="4px" />
              <Skeleton width="44px" height="24px" radius="12px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPageSkeleton = () => {
    switch (normalizedPath) {
      case "/adminDashboard":
      case "/adminDashboard/adminDashboard":
      case "/adminDashboard/home":
        return renderHomeSkeleton();
      case "/adminDashboard/employee":
        return renderEmployeeSkeleton();
      case "/adminDashboard/attendance":
        return renderAttendanceSkeleton();
      case "/adminDashboard/appearence":
        return renderAppearanceSkeleton();
      case "/adminDashboard/leave":
        return renderLeaveSkeleton();
      case "/adminDashboard/thought":
        return renderThoughtSkeleton();
      case "/adminDashboard/notification":
        return renderNotificationSkeleton();
      case "/adminDashboard/announcement":
        return renderAnnouncementSkeleton();
      case "/adminDashboard/report":
        return renderReportSkeleton();
      case "/adminDashboard/setting":
        return renderSettingSkeleton();
      default:
        return renderHomeSkeleton();
    }
  };

  return (
    <>
      <BirthdayCelebration isAdmin={true} />

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
                <FaBell style={{ fontSize: "18px" }} />
              </div>

              <div className="admin-profile">
                <AdminProfile />
              </div>
            </div>
          </div>

          {showPageSkeleton && !isCalendarPage ? (
            <div role="status" aria-label={`Loading ${currentPage.title}`} aria-busy="true">
              {renderPageSkeleton()}
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </>
  );
}

