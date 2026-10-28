import { FaBell, FaCloud } from "react-icons/fa6";
import { RiTargetFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";


import "./DashboardNotification.css";
import { PulseDot } from "./../../PulseDot/pulseDot";
import { NotificationForm } from "./NotificationForm";

export const DashboardNotification = () => {

  const recentNotification = [
    {
      icon: <FaHeart style={{ color: "#ee2a44" }} />,
      notificationTitle: "Sarah Mitchell liked a thought post",
      time: "2m ago",
    },
    {
      icon: <FaTriangleExclamation style={{ color: "#f6be5d" }} />,
      notificationTitle: "3 employees haven't checked in today",
      time: "10m ago",
    },
    {
      icon: <FaBell style={{ color: "#ef9b52" }} />,
      notificationTitle: "Monthly attendance report is ready to export",
      time: "1h ago",
    },
    {
      icon: <FaCloud />,
      notificationTitle: "New comment on company announcement",
      time: "3h ago",
    },
    {
      icon: <RiTargetFill style={{ color: "#ff6da8" }} />,
      notificationTitle: "Attendance sync completed successfully",
      time: "Yesterday",
    },
  ];

  return (
    <>
      <div className="dashboardNotification-container">
        <NotificationForm />
        <div className="dashboard-recent-notification">
          <div className="recent-notification-header">
            <h3>Recent Notifications</h3>
            <span>3 unread</span>
          </div>
          <div className="recent-notification-content-container">
            {recentNotification &&
              recentNotification.map((el, id) => (
                <div
                  className="recent-notification-content"
                  key={id}
                >
                  <div className="recent-notification-type">
                    <div className="recent-notification-icon">{el.icon}</div>
                    <div className="recent-notification-msg">
                      <p>{el.notificationTitle}</p>
                      <span>{el.time}</span>
                    </div>
                  </div>
                  <PulseDot
                    className="recent-notification-active"
                    color="var(--text_primary)"
                    size="8px"
                    speed="2.5s"
                    scale="2.5"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};
