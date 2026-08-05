import "./QuickActions.css";
import ActionCard from "./ActionCard";
import { FaCalendarCheck, FaUsers, FaCog, FaChartBar } from "react-icons/fa";
import { useState, useEffect } from "react";
import Skeleton from "../../../components/Skeleton/Skeleton";

export default function QuickActions() {
  const actions = [
    {
      title: "Attendance",

      description: "View today's attendance and history.",

      icon: <FaCalendarCheck />,

      to: "/attendance",
    },

    {
      title: "Community",

      description: "Share ideas with your colleagues.",

      icon: <FaUsers />,

      to: "/community",
    },

    {
      title: "Reports",

      description: "See your work analytics.",

      icon: <FaChartBar />,

      to: "/reports",
    },

    {
      title: "Settings",

      description: "Manage profile and preferences.",

      icon: <FaCog />,

      to: "/settings",
    },
  ];

//skeleton//
const [showSkeleton, setShowSkeleton] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setShowSkeleton(false);
  }, 1500);

  return () => clearTimeout(timer);
}, []);

if (showSkeleton) {
  return (
    <section className="quick_actions">
      <Skeleton width="180px" height="32px" />

      <div
        className="quick_grid"
        style={{ marginTop: "20px" }}
      >
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            style={{
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
            }}
          >
            <Skeleton width="50px" height="50px" radius="50%" />

            <div style={{ marginTop: "18px" }}>
              <Skeleton width="120px" height="18px" />
            </div>

            <div style={{ marginTop: "10px" }}>
              <Skeleton width="100%" height="14px" />
            </div>

            <div style={{ marginTop: "6px" }}>
              <Skeleton width="80%" height="14px" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

//skeleton//

  return (
    <section className="quick_actions" id="tour-quick-actions">
      <h2>Quick Actions</h2>

      <div className="quick_grid">
        {actions.map((action, i) => (
          <ActionCard id={i + 1} key={action.title} {...action} />
        ))}
      </div>
    </section>
  );
}
