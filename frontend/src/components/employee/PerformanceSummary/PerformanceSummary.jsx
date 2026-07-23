import "./PerformanceSummary.css";
import { useSelector } from "react-redux";

import {
  FaClock,
  FaCoffee,
  FaBullseye,
  FaTrophy,
} from "react-icons/fa";

export default function PerformanceSummary() {
  const { stats } = useSelector((state) => state.dashboard);

  const items = [
    {
      title: "Average Check-in",
      value: stats.averageCheckIn,
      icon: <FaClock />,
    },
    {
      title: "Average Break",
      value: `${stats.averageBreakDuration} mins`,
      icon: <FaCoffee />,
    },
    {
      title: "Weekly Goal",
      value: `${stats.weeklyGoalPercentage}%`,
      icon: <FaBullseye />,
    },
    {
      title: "Best Streak",
      value: `${stats.longestStreak} Days`,
      icon: <FaTrophy />,
    },
  ];

  return (
    <section className="performance_summary">

      <div className="section_header">
        <h2>Performance Summary</h2>
      </div>

      <div className="performance_grid">

        {items.map((item) => (
          <div className="performance_item" key={item.title}>

            <div className="performance_icon">
              {item.icon}
            </div>

            <div>
              <span>{item.title}</span>
              <h3>{item.value}</h3>
            </div>

          </div>
        ))}

      </div>

    </section>
  );
}
