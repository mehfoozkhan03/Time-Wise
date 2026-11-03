import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";


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

import "./NotificationPage.css";
import { fetchNotifications, markAllAsRead as markAllAsReadThunk, markAsRead, removeNotification } from './../../store/notificationSlice';

export const NotificationPage = () => {
  const [filter, setFilter] = useState("all");
  const [activeMenu, setActiveMenu] = useState(null);


  const dispatch = useDispatch();
  const { notifications, loading, isError, errorMessage } = useSelector(
    (state) => state.notification
  );
  console.log("🚀 ~ notifications:", notifications);

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  const readCount = notifications.filter(
    (item) => item.read
  ).length;

  const todayCount = notifications.filter(
    (item) =>
      new Date(item.createdAt).toDateString() ===
      new Date().toDateString()
  ).length;

  const filteredNotifications = notifications.filter((item) => {
    if (filter === "read") return item.read;
    if (filter === "unread") return !item.read;

    if (filter === "today") {
      return (
        new Date(item.createdAt).toDateString() ===
        new Date().toDateString()
      );
    }

    return true;
  });

  const handleMarkAsRead = async (id) => {
    try {
      await dispatch(markAsRead(id)).unwrap();
      setActiveMenu(null);
    } catch (error) {
      console.error("Mark as read failed:", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await dispatch(removeNotification(id)).unwrap();
      setActiveMenu(null);
    } catch (error) {
      console.error("Delete notification failed:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllAsReadThunk()).unwrap();
    } catch (error) {
      console.error("Mark all as read failed:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="notifications-page">

      {/* HEADER */}
      <div className="notifications-header">
        <div className="notifications-title">
          <div>
            <FaBell />
            <h2>Notifications</h2>
          </div>
          <p>Stay updated with your latest activities</p>
        </div>

        <div className="notifications-header-right">
          <button
            className="mark-all-btn"
            onClick={handleMarkAllAsRead}
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
          className={`notification-stat-card all ${filter === "all" ? "stat-active" : ""
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
          className={`notification-stat-card read ${filter === "read" ? "stat-active" : ""
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
          className={`notification-stat-card today ${filter === "today" ? "stat-active" : ""
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
          <p>{notifications.length} notifications found</p>
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
              className={`notification-item ${!item.read ? "unread-item" : ""
                }`}
              key={item._id}
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
                <p>{item.message}</p>

                <span className="notification-time">
                  <FaClock />
                  {new Date(item.createdAt).toLocaleString()}
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

                {!item.read && (
                  <span className="unread-dot"></span>
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

                    {!item.read && (
                      <button onClick={() => handleMarkAsRead(item._id)}>
                        <FaCheck />
                        Mark as read
                      </button>
                    )}

                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteNotification(item._id)}
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