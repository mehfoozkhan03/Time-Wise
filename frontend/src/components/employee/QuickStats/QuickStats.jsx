

import { useSelector } from "react-redux";
import {
  FaCalendarCheck,
  FaBullseye,
  FaFire,
  FaClock,
} from "react-icons/fa";

import "./QuickStats.css";
import Card from "../../Card/Card";
import Skeleton from "../../Skeleton/Skeleton";
import useCountUp from "../../../components/UseCount/Count";

export default function QuickStats() {
  const { stats, loading } = useSelector(
    (state) => state.dashboard
  );

  const attendanceValue = Number(stats?.attendancePercentage) || 0;
  const productivityValue = Number(stats?.productivity) || 0;
  const monthlyHoursValue = Number(stats?.monthlyHours) || 0;
  const dayStreakValue = Number(stats?.dayStreak) || 0;

  const attendance = useCountUp(attendanceValue, 2000);
  const productivity = useCountUp(productivityValue, 2000);
  const monthlyHours = useCountUp(monthlyHoursValue, 2000);
  const dayStreak = useCountUp(dayStreakValue, 2000);

  const quickStats = [
    {
      title: "Attendance",
      value: `${attendance}%`,
      icon: <FaCalendarCheck />,
      color: "#22c55e",
    },
    {
      title: "Work Efficiency",
      value: `${productivity}%`,
      icon: <FaBullseye />,
      color: "#29A3E0",
    },
    {
      title: "Monthly Hours",
      value: `${monthlyHours}h`,
      icon: <FaClock />,
      color: "#8b5cf6",
    },
    {
      title: "Current Streak",
      value: `${dayStreak} Days`,
      icon: <FaFire />,
      color: "#f59e0b",
    },
  ];

  // Skeleton Loader
  if (loading) {
    return (
      <section className="profile_stats quick-stats-skeleton">
        {[1, 2, 3, 4].map((item) => (
          <Card className="profile_stat_card" key={item}>
            <div className="quick-stats-skeleton-icon">
              <Skeleton
                width="48px"
                height="48px"
                radius="12px"
              />
            </div>

            <div className="profile_stat_content quick-stats-skeleton-content">
              <Skeleton width="100px" height="14px" />

              <div className="quick-stats-skeleton-value">
                <Skeleton width="75px" height="26px" />
              </div>
            </div>
          </Card>
        ))}
      </section>
    );
  }

  return (
    <section className="profile_stats">
      {quickStats.map((stat) => (
        <Card className="profile_stat_card" key={stat.title}>
          <div
            className="profile_stat_icon"
            style={{
              background: `${stat.color}20`,
              color: stat.color,
            }}
          >
            {stat.icon}
          </div>

          <div className="profile_stat_content">
            <span>{stat.title}</span>
            <h2>{stat.value}</h2>
          </div>
        </Card>
      ))}
    </section>
  );
}
