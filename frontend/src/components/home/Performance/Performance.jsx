import "./Performance.css";
import PerformanceCard from "./PerformanceCard";
import { FaBullseye, FaClock, FaFire, FaCalendarCheck } from "react-icons/fa";

export default function Performance() {
  const stats = [
    {
      title: "Attendance",

      value: "97%",

      subtitle: "Excellent consistency",

      progress: 97,

      color: "#22c55e",

      icon: <FaCalendarCheck />,
    },

    {
      title: "Productivity",

      value: "89%",

      subtitle: "+6% from last week",

      progress: 89,

      color: "#29A3E0",

      icon: <FaBullseye />,
    },

    {
      title: "Weekly Hours",

      value: "39.2",

      subtitle: "Goal 45h",

      progress: 87,

      color: "#8b5cf6",

      icon: <FaClock />,
    },

    {
      title: "Current Streak",

      value: "12",

      subtitle: "Personal Best",

      progress: 100,

      color: "#f59e0b",

      icon: <FaFire />,
    },
  ];

  return (
    <section className="performance" id="tour-stats-grid">
      <h2>Your Performance</h2>

      <div className="performance_grid">
        {stats.map((stat) => (
          <PerformanceCard key={stat.title} {...stat} />
        ))}
      </div>
    </section>
  );
}
