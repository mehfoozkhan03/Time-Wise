import "./QuickActions.css";

import ActionCard from "./ActionCard";

import { FaCalendarCheck, FaUsers, FaCog, FaChartBar } from "react-icons/fa";

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

  return (
    <section className="quick_actions" id="tour-quick-actions">
      <h2>Quick Actions</h2>

      <div className="quick_grid">
        {actions.map((action) => (
          <ActionCard key={action.title} {...action} />
        ))}
      </div>
    </section>
  );
}
