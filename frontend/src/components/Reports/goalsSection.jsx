import { SectionLabel } from "./sectionLabel";
import { GoalProgress } from "./goalProgress";

export function GoalsSection({ dashboardStats }) {
  console.log("Goals dashboardStats:", dashboardStats);

  const goals = [
    {
      label: "Weekly Hours",
      current: dashboardStats?.weeklyHours ?? 0,
      target: dashboardStats?.weeklyTarget ?? 40,
      unit: "hrs",
      color: "#6366f1",
    },
    {
      label: "Attendance Rate",
      current: dashboardStats?.attendancePercentage ?? 0,
      target: 100,
      unit: "%",
      color: "#10b981",
    },
    {
      label: "Productivity Score",
      current: dashboardStats?.productivity ?? 0,
      target: 100,
      unit: "%",
      color: "#22d3ee",
    },
    {
      label: "Monthly Hours",
      current: dashboardStats?.monthlyHours ?? 0,
      target: 176,
      unit: "hrs",
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <SectionLabel>Goals & Targets</SectionLabel>

      {goals.map((goal) => (
        <GoalProgress key={goal.label} {...goal} />
      ))}
    </div>
  );
}
