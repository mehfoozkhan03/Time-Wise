import { useSelector } from "react-redux";

import {
  FaClock,
  FaCoffee,
  FaBullseye,
  FaTrophy,
} from "react-icons/fa";

import Skeleton from "../../Skeleton/Skeleton";
import "./PerformanceSummary.css";

export default function PerformanceSummary() {
  const { stats, loading } = useSelector(
    (state) => state.dashboard
  );

  const items = [
    {
      title: "Average Check-in",
      value: stats?.averageCheckIn ?? "--",
      icon: <FaClock />,
    },
    {
      title: "Average Break",
      value: `${stats?.averageBreakDuration ?? 0} mins`,
      icon: <FaCoffee />,
    },
    {
      title: "Weekly Goal",
      value: `${stats?.weeklyGoalPercentage ?? 0}%`,
      icon: <FaBullseye />,
    },
    {
      title: "Best Streak",
      value: `${stats?.longestStreak ?? 0} Days`,
      icon: <FaTrophy />,
    },
  ];

  // Skeleton Loader
  if (loading) {
    return (
      <section className="performance_summary performance-summary-skeleton">
        <div className="section_header">
          <Skeleton width="220px" height="24px" />
        </div>

        <div className="performance_grid">
          {[1, 2, 3, 4].map((item) => (
            <div className="performance_item" key={item}>
              <div className="performance_icon">
                <Skeleton
                  width="42px"
                  height="42px"
                  radius="10px"
                />
              </div>

              <div className="performance-skeleton-content">
                <Skeleton width="115px" height="14px" />

                <div className="performance-skeleton-value">
                  <Skeleton width="80px" height="22px" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

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
