import { SectionLabel } from "./sectionLabel";
import useCountUp from "../../components/UseCount/Count";

export function WorkSummary({ dashboardStats }) {

const weeklyHours = useCountUp(dashboardStats.weeklyHours);
const monthlyHours = useCountUp(dashboardStats.monthlyHours);
const productivity = useCountUp(dashboardStats.productivity);
const punctuality = useCountUp(dashboardStats.punctuality);
const dayStreak = useCountUp(dashboardStats.dayStreak);
const longestStreak = useCountUp(dashboardStats.longestStreak);
const averageBreakDuration = useCountUp(dashboardStats.averageBreakDuration);
const weeklyGoalPercentage = useCountUp(dashboardStats.weeklyGoalPercentage);

  const dynamicSummaryItems = [
    {
      label: "Weekly Hours",
       value: `${weeklyHours}h`,
      icon: "📅",
    },
    {
      label: "Monthly Hours",
      value: `${monthlyHours}h`,
      icon: "🕐",
    },
    {
      label: "Productivity",
      value: `${productivity}%`,
      icon: "💡",
    },
    {
      label: "Punctuality",
      value: `${punctuality}%`,
      icon: "⏰",
    },
    {
      label: "Current Streak",
      value: `${dayStreak} days`,
      icon: "🔥",
    },
    {
      label: "Longest Streak",
      value: `${longestStreak} days`,
      icon: "🏆",
    },
    {
      label: "Avg Break",
      value: `${averageBreakDuration} min`,
      icon: "☕",
    },
    {
      label: "Weekly Goal",
      value: `${weeklyGoalPercentage}%`,
      icon: "🎯",
    },
  ];

  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <SectionLabel>Work Summary</SectionLabel>

      <div
        className="work_summary_div"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 13,
        }}
      >
        {dynamicSummaryItems.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 10,
              padding: "12px 14px",
            }}
            className="workDiv"
          >
            <div
              style={{
                fontSize: 19,
                marginBottom: 4,
              }}
            >
              {item.icon}
            </div>

            <div
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 2,
              }}
            >
              {item.value}
            </div>

            <div
              style={{
                fontSize: 17,
                color: "#475569",
                textTransform: "capitalize",
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
