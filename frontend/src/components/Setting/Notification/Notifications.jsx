// import { useSelector } from "react-redux";
// import { useState, useEffect } from "react";
// import { SwitchBtn } from "../../SwichBtn/SwitchBtn";
// import "./Notification.css"
// import Skeleton from "../../../components/Skeleton/Skeleton";

// export const Notification = () => {

//     const { user, isLoading } = useSelector((state) => state.auth);
//     const [showSkeleton, setShowSkeleton] = useState(true);


//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setShowSkeleton(false);
//         }, 1500);

//         return () => clearTimeout(timer);
//     }, []);

//     if (showSkeleton) {
//         return (
//             <div className="notification-container">

//                 {/* Heading Skeleton */}
//                 <div className="notification-heading">
//                     <Skeleton width="180px" height="32px" />

//                     <div style={{ marginTop: "10px" }}>
//                         <Skeleton width="400px" height="18px" />
//                     </div>
//                 </div>


//                 {/* Delivery Channels Skeleton */}
//                 <div className="delivery-channels">
//                     <Skeleton width="180px" height="25px" />

//                     <div className="delivery-content">
//                         {[1, 2, 3].map((item) => (
//                             <div
//                                 key={item}
//                                 style={{
//                                     display: "flex",
//                                     justifyContent: "space-between",
//                                     alignItems: "center",
//                                     padding: "15px 0",
//                                 }}
//                             >
//                                 <div>
//                                     <Skeleton width="180px" height="20px" />

//                                     <div style={{ marginTop: "8px" }}>
//                                         <Skeleton width="250px" height="15px" />
//                                     </div>
//                                 </div>

//                                 <Skeleton width="45px" height="25px" radius="20px" />
//                             </div>
//                         ))}
//                     </div>
//                 </div>


//                 {/* Notification Types Skeleton */}
//                 <div className="notification-type-container">
//                     <Skeleton width="200px" height="28px" />

//                     <div className="type-detail">
//                         {[1, 2, 3, 4, 5, 6].map((item) => (
//                             <div
//                                 key={item}
//                                 style={{
//                                     display: "flex",
//                                     justifyContent: "space-between",
//                                     alignItems: "center",
//                                     padding: "15px 0",
//                                 }}
//                             >
//                                 <div>
//                                     <Skeleton width="200px" height="20px" />

//                                     <div style={{ marginTop: "8px" }}>
//                                         <Skeleton width="320px" height="15px" />
//                                     </div>
//                                 </div>

//                                 <Skeleton width="45px" height="25px" radius="20px" />
//                             </div>
//                         ))}
//                     </div>
//                 </div>


//                 {/* Frequency Skeleton */}
//                 <div className="frequency">
//                     <Skeleton width="120px" height="28px" />

//                     <div
//                         style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             marginTop: "20px",
//                         }}
//                     >
//                         <div>
//                             <Skeleton width="160px" height="20px" />

//                             <div style={{ marginTop: "8px" }}>
//                                 <Skeleton width="250px" height="15px" />
//                             </div>
//                         </div>

//                         <Skeleton width="150px" height="40px" radius="8px" />
//                     </div>
//                 </div>

//             </div>
//         );
//     }

//     return (
//         <>
//             <div className="notification-container">
//                 <div className="notification-heading">
//                     <h2>Notifications</h2>
//                     <p>Choose what you"re notified about and how you receive alerts.</p>
//                 </div>


//                 {/* Notification channels */}
//                 <div className="delivery-channels">
//                     <div className="delivery-heading">
//                         <h3>Delivery channels</h3>
//                     </div>
//                     <div className="delivery-content">
//                         <div className="email-notification">
//                             <div>
//                                 <h3>Email notifications</h3>
//                                 <p>Sent to {user?.email ?? "No Email"}</p>
//                             </div>
//                             <div>
//                                 <SwitchBtn />
//                             </div>
//                         </div>
//                         <div className="push-notification">
//                             <div>
//                                 <h3>Push notifications</h3>
//                                 <p>Browser and mobile app alerts</p>
//                             </div>
//                             <div>
//                                 <SwitchBtn />
//                             </div>
//                         </div>
//                         <div className="sms-alert">
//                             <div>
//                                 <h3>SMS alerts</h3>
//                                 <p>Text messages to 9262986281</p>
//                             </div>
//                             <div>
//                                 <SwitchBtn />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Notification types */}
//                 <div className="notification-type-container">
//                     <div className="type-heading">
//                         <h2>Notification types</h2>
//                     </div>
//                     <div className="type-detail">
//                         <div className="checkin-reminder">
//                             <div>
//                                 <h3>Check-in reminder</h3>
//                                 <p>5-minute reminder before your scheduled check-in</p>
//                             </div>
//                             <div>
//                                 <SwitchBtn />
//                             </div>
//                         </div>
//                         <div className="checkout-reminder">
//                             <div>
//                                 <h3>Check-out reminder</h3>
//                                 <p>Alert when your scheduled check-out time approaches</p>
//                             </div>
//                             <div>
//                                 <SwitchBtn />
//                             </div>
//                         </div>
//                         <div className="leave-approval">
//                             <div>
//                                 <h3>Leave approval updates</h3>
//                                 <p>When your leave requests are approved or declined</p>
//                             </div>
//                             <div>
//                                 <SwitchBtn />
//                             </div>
//                         </div>
//                         <div className="payslip-available">
//                             <div>
//                                 <h3>Payslip available</h3>
//                                 <p>When a new payslip is generated for your account</p>
//                             </div>
//                             <div>
//                                 <SwitchBtn />
//                             </div>
//                         </div>
//                         <div className="team-update">
//                             <div>
//                                 <h3>Team updates</h3>
//                                 <p>When teammates change schedules or submit leave requests</p>
//                             </div>
//                             <div>
//                                 <SwitchBtn />
//                             </div>
//                         </div>
//                         <div className="weekly-digest">
//                             <div>
//                                 <h3>Weekly digest</h3>
//                                 <p>Summary of your hours and attendance every Monday</p>
//                             </div>
//                             <div>
//                                 <SwitchBtn />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Save changes */}
//                 <div className="save_changes">
//                     <div>
//                         <p>Unsaved changes</p>
//                     </div>
//                     <button
//                         type="button"
//                         className="change-btn"
//                     >
//                         Save changes
//                     </button>
//                 </div>

//             </div>
//         </>
//     )
// }




import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { SwitchBtn } from "../../SwichBtn/SwitchBtn";
import "./Notification.css"
import Skeleton from "../../../components/Skeleton/Skeleton";
import { SettingCustomDropdown } from "../SettingCustomDropdown/SettingCustomDropdown";
import React, { useMemo } from "react";
import {
  FaBell,
  FaUsers,
  FaCheckCircle,
  FaCalendarAlt,
  FaEllipsisH,
  FaClock,
  FaFileAlt,
  FaBullhorn,
  FaUser,
  FaCalendarCheck,
  FaTrash,
  FaCheck,
} from "react-icons/fa";

import {
    FaBell,
    FaLayerGroup,
    FaEnvelope,
    FaMobileAlt,
    FaCommentDots,
    FaCalendarAlt,
    FaClock,
    FaSignOutAlt,
    FaFileInvoice,
    FaUsers,
    FaChartBar,
    FaCheck,
} from "react-icons/fa";

import { SwitchBtn } from "../../SwichBtn/SwitchBtn";
import Skeleton from "../../../components/Skeleton/Skeleton";

import "./Notification.css";

export const Notification = () => {

    const { user, isLoading } = useSelector((state) => state.auth);

    const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const [activeFilter, setActiveFilter] = useState("all");
const [activeMenu, setActiveMenu] = useState(null);

// Existing API notifications array
const notificationList = Array.isArray(notifications)
  ? notifications
  : [];

const visibleNotifications = notificationList.filter(
  (item) => !item.deleted && !item.isArchived
);

const unreadCount = visibleNotifications.filter(
  (item) => !item.read
).length;

const readCount = visibleNotifications.filter(
  (item) => item.read
).length;

const todayCount = visibleNotifications.filter((item) => {
  if (!item.createdAt) return false;

  const date = new Date(item.createdAt);
  const today = new Date();

  return date.toDateString() === today.toDateString();
}).length;

const filteredNotifications = visibleNotifications.filter((item) => {
  if (activeFilter === "read") return item.read;
  if (activeFilter === "unread") return !item.read;

  if (activeFilter === "today") {
    if (!item.createdAt) return false;

    return (
      new Date(item.createdAt).toDateString() ===
      new Date().toDateString()
    );
  }

  return true;
});

// Date formatting
const formatNotificationDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Sender name
const getSenderName = (sender) => {
  if (!sender) return "Unknown User";

  const name = [
    sender.firstName,
    sender.lastName,
  ].filter(Boolean).join(" ");

  return name || "Unknown User";
};

// Notification icon
const getNotificationIcon = (type) => {
  switch (type?.toLowerCase()) {
    case "post":
      return <FaFileAlt />;

    case "announcement":
      return <FaBullhorn />;

    case "leave":
      return <FaCalendarAlt />;

    case "attendance":
      return <FaCalendarCheck />;

    case "user":
      return <FaUser />;

    default:
      return <FaBell />;
  }
};
    if (showSkeleton) {
        return (
            <div className="notification-container notification-skeleton">

                <div className="notification-heading">
                    <Skeleton width="180px" height="32px" />
                    <div style={{ marginTop: "10px" }}>
                        <Skeleton width="400px" height="18px" />
                    </div>
                </div>

                <div className="delivery-channels">
                    <Skeleton width="180px" height="25px" />

                    <div className="delivery-content">
                        {[1, 2, 3].map((item) => (
                            <div className="notification-skeleton-row" key={item}>
                                <div>
                                    <Skeleton width="180px" height="20px" />
                                    <div style={{ marginTop: "8px" }}>
                                        <Skeleton width="250px" height="15px" />
                                    </div>
                                </div>

                                <Skeleton width="45px" height="25px" radius="20px" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="notification-type-container">
                    <Skeleton width="200px" height="28px" />

                    <div className="type-detail">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div className="notification-skeleton-row" key={item}>
                                <div>
                                    <Skeleton width="200px" height="20px" />
                                    <div style={{ marginTop: "8px" }}>
                                        <Skeleton width="320px" height="15px" />
                                    </div>
                                </div>

                                <Skeleton width="45px" height="25px" radius="20px" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="save_changes">
                    <Skeleton width="150px" height="20px" />
                    <Skeleton width="130px" height="40px" radius="8px" />
                </div>

            </div>
        );
    }

    // =========================
    // ORIGINAL UI
    // =========================

    return (
  <div className="notifications-page">

    {/* HEADER */}
    <div className="notifications-header">
      <div className="notifications-title">
        <FaBell />
        <div>
          <h2>Notifications</h2>
          <p>Stay updated with your latest activities</p>
        </div>
      </div>

      <button className="notification-settings-btn">
        <FaEllipsisH />
      </button>
    </div>

    {/* SUMMARY CARDS */}
    <div className="notification-stats">

      <div
        className={`notification-stat-card all ${
          activeFilter === "all" ? "stat-active" : ""
        }`}
        onClick={() => setActiveFilter("all")}
      >
        <div className="stat-icon">
          <FaUsers />
        </div>

        <div className="stat-content">
          <h3>{visibleNotifications.length}</h3>
          <p>All Notifications</p>
          <span>{unreadCount} unread</span>
        </div>

        <b>›</b>
      </div>

      <div
        className={`notification-stat-card read ${
          activeFilter === "read" ? "stat-active" : ""
        }`}
        onClick={() => setActiveFilter("read")}
      >
        <div className="stat-icon">
          <FaCheckCircle />
        </div>

        <div className="stat-content">
          <h3>{readCount}</h3>
          <p>Read Notifications</p>
          <span>
            {visibleNotifications.length
              ? ((readCount / visibleNotifications.length) * 100).toFixed(1)
              : 0}
            % of total
          </span>
        </div>

        <b>›</b>
      </div>

      <div
        className={`notification-stat-card today ${
          activeFilter === "today" ? "stat-active" : ""
        }`}
        onClick={() => setActiveFilter("today")}
      >
        <div className="stat-icon">
          <FaCalendarAlt />
        </div>

        <div className="stat-content">
          <h3>{todayCount}</h3>
          <p>Today Notifications</p>
          <span>Recent activities today</span>
        </div>

        <b>›</b>
      </div>

    </div>

    {/* LIST HEADER */}
    <div className="notification-list-heading">

      <div>
        <h3>Recent Notifications</h3>
        <p>{filteredNotifications.length} notifications found</p>
      </div>

      <div className="notification-tabs">

        <button
          className={activeFilter === "all" ? "active" : ""}
          onClick={() => setActiveFilter("all")}
        >
          All
        </button>

        <button
          className={activeFilter === "unread" ? "active" : ""}
          onClick={() => setActiveFilter("unread")}
        >
          Unread
          {unreadCount > 0 && <span>{unreadCount}</span>}
        </button>

        <button
          className={activeFilter === "read" ? "active" : ""}
          onClick={() => setActiveFilter("read")}
        >
          Read
        </button>

      </div>
    </div>

    {/* NOTIFICATION LIST */}
    <div className="notification-list">

      {filteredNotifications.length > 0 ? (

        filteredNotifications.map((item) => (

          <div
            className={`notification-item ${
              !item.read ? "unread-item" : ""
            }`}
            key={item._id}
          >

            {/* ICON */}
            <div className={`notification-icon ${
              item.type?.toLowerCase() || "default"
            }`}>
              {getNotificationIcon(item.type)}
            </div>

            {/* DETAILS */}
            <div className="notification-details">

              <h4>
                {item.title || "Notification"}
              </h4>

              <p>
                {item.message}
              </p>

              <div className="notification-meta">

                <span className="notification-sender">
                  <FaUser />
                  {getSenderName(item.sender)}
                </span>

                <span className="notification-time">
                  <FaClock />
                  {formatNotificationDate(item.createdAt)}
                </span>

              </div>

            </div>

            {/* STATUS AND MENU */}
            <div className="notification-actions">

              {!item.read && (
                <span
                  className="unread-dot"
                  title="Unread notification"
                />
              )}

              <button
                className="more-btn"
                onClick={() =>
                  setActiveMenu(
                    activeMenu === item._id ? null : item._id
                  )
                }
              >
                <FaEllipsisH />
              </button>

              {activeMenu === item._id && (
                <div className="notification-dropdown">

                  <div className="notification-menu-info">
                    <span>Status</span>
                    <strong>
                      {item.read ? "Read" : "Unread"}
                    </strong>
                  </div>

                  <div className="notification-menu-info">
                    <span>Type</span>
                    <strong>{item.type || "General"}</strong>
                  </div>

                  <div className="notification-menu-info">
                    <span>Reference</span>
                    <strong>{item.referenceModel || "N/A"}</strong>
                  </div>

                  <button
                    onClick={() => setActiveMenu(null)}
                  >
                    <FaCheck />
                    Close
                  </button>

                </div>
              )}

            </div>

          </div>

        ))

      ) : (

        <div className="notification-empty">
          <FaBell />
          <h3>No notifications found</h3>
          <p>You're all caught up!</p>
        </div>

      )}

    </div>

  </div>
);
}
