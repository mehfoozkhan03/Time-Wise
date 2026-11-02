import React, { useState } from "react";
import {
  FaBell,
  FaUsers,
  FaCheckCircle,
  FaCalendarAlt,
  FaEnvelope,
  FaBullhorn,
  FaClock,
  FaUser,
  FaStar,
  FaEllipsisH,
  FaCheck,
  FaTrash,
  FaCog,
} from "react-icons/fa";

import "./Notifications.css";

const notificationsData = [
  {
    id: 1,
    title: "New leave request received",
    description:
      "Aarav Sharma has requested 3 days of casual leave (Nov 2 - Nov 5, 2026).",
    date: "Today, 10:24 AM",
    type: "leave",
    unread: true,
    today: true,
  },
  {
    id: 2,
    title: "Leave request approved",
    description:
      "Your leave request for Nov 1, 2026 has been approved by Priya Mehta.",
    date: "Today, 09:42 AM",
    type: "approved",
    unread: false,
    today: true,
  },
  {
    id: 3,
    title: "New announcement: Monthly Town Hall",
    description:
      "Join us for the Monthly Town Hall on Oct 30, 2026 at 04:00 PM. All employees are requested to attend.",
    date: "Oct 28, 2026, 03:45 PM",
    type: "announcement",
    unread: false,
    today: false,
    banner: true,
  },
  {
    id: 4,
    title: "Attendance reminder",
    description:
      "Don't forget to mark your attendance for today. It's important for your daily records.",
    date: "Oct 28, 2026, 09:00 AM",
    type: "attendance",
    unread: false,
    today: false,
  },
  {
    id: 5,
    title: "Your profile was updated",
    description:
      "Your profile information has been updated successfully.",
    date: "Oct 27, 2026, 04:32 PM",
    type: "profile",
    unread: false,
    today: false,
  },
  {
    id: 6,
    title: "New recognition",
    description:
      "You've received a 'Team Player' badge from Rohan Verma for your contribution to the project.",
    date: "Oct 26, 2026, 01:15 PM",
    type: "recognition",
    unread: false,
    today: false,
  },
  {
    id: 7,
    title: "New team member",
    description:
      "Sneha Patel has joined the Marketing department. Welcome her to the team!",
    date: "Oct 25, 2026, 11:20 AM",
    type: "team",
    unread: false,
    today: false,
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(notificationsData);
  const [filter, setFilter] = useState("all");
  const [activeMenu, setActiveMenu] = useState(null);

  const unreadCount = notifications.filter(
    (item) => item.unread
  ).length;

  const readCount = notifications.length - unreadCount;

  const todayCount = notifications.filter(
    (item) => item.today
  ).length;

  const filteredNotifications = notifications.filter((item) => {
    if (filter === "read") return !item.unread;
    if (filter === "unread") return item.unread;
    if (filter === "today") return item.today;
    return true;
  });

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      )
    );
    setActiveMenu(null);
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((item) => item.id !== id)
    );
    setActiveMenu(null);
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, unread: false }))
    );
  };

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

        <div className="notifications-header-right">
          <button
            className="mark-all-btn"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <FaCheck />
            Mark all as read
          </button>

          <button className="notification-settings-btn">
            <FaCog />
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="notification-stats">

        <div
          className={`notification-stat-card all ${
            filter === "all" ? "stat-active" : ""
          }`}
          onClick={() => setFilter("all")}
        >
          <div className="stat-icon">
            <FaUsers />
          </div>

          <div className="stat-content">
            <h3>{notifications.length}</h3>
            <p>All Notifications</p>
            <span>↑ {unreadCount} unread</span>
          </div>

          <b>›</b>
        </div>

        <div
          className={`notification-stat-card read ${
            filter === "read" ? "stat-active" : ""
          }`}
          onClick={() => setFilter("read")}
        >
          <div className="stat-icon">
            <FaCheckCircle />
          </div>

          <div className="stat-content">
            <h3>{readCount}</h3>
            <p>Read Notifications</p>
            <span>
              {notifications.length
                ? ((readCount / notifications.length) * 100).toFixed(1)
                : 0}
              % of total
            </span>
          </div>

          <b>›</b>
        </div>

        <div
          className={`notification-stat-card today ${
            filter === "today" ? "stat-active" : ""
          }`}
          onClick={() => setFilter("today")}
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
            className={filter === "all" || filter === "today" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            className={filter === "unread" ? "active" : ""}
            onClick={() => setFilter("unread")}
          >
            Unread
            {unreadCount > 0 && <span>{unreadCount}</span>}
          </button>

          <button
            className={filter === "read" ? "active" : ""}
            onClick={() => setFilter("read")}
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
                item.unread ? "unread-item" : ""
              }`}
              key={item.id}
            >

              <div className={`notification-icon ${item.type}`}>
                {item.type === "leave" && <FaEnvelope />}
                {item.type === "approved" && <FaCheckCircle />}
                {item.type === "announcement" && <FaBullhorn />}
                {item.type === "attendance" && <FaClock />}
                {item.type === "profile" && <FaUser />}
                {item.type === "recognition" && <FaStar />}
                {item.type === "team" && <FaUsers />}
              </div>

              <div className="notification-details">
                <h4>{item.title}</h4>
                <p>{item.description}</p>

                <span className="notification-time">
                  <FaClock />
                  {item.date}
                </span>
              </div>

              {item.banner && (
                <div className="notification-banner">
                  <div>
                    <strong>Monthly</strong>
                    <strong>Town Hall</strong>
                    <small>Join us today!</small>
                  </div>
                  <FaUsers />
                </div>
              )}

              <div className="notification-actions">

                {item.unread && (
                  <span className="unread-dot"></span>
                )}

                <button
                  className="more-btn"
                  onClick={() =>
                    setActiveMenu(
                      activeMenu === item.id ? null : item.id
                    )
                  }
                >
                  <FaEllipsisH />
                </button>

                {activeMenu === item.id && (
                  <div className="notification-dropdown">

                    {item.unread && (
                      <button onClick={() => markAsRead(item.id)}>
                        <FaCheck />
                        Mark as read
                      </button>
                    )}

                    <button
                      className="delete-btn"
                      onClick={() => deleteNotification(item.id)}
                    >
                      <FaTrash />
                      Delete
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
};

export default Notifications;