import { SectionLabel } from "./sectionLabel";
import { GoalProgress } from "./goalProgress";
import useCountUp from "../../components/UseCount/Count";
export function GoalsSection({ dashboardStats }) {
  // console.log("Goals dashboardStats:", dashboardStats);
const weeklyHours = useCountUp(dashboardStats?.weeklyHours ?? 0);
const attendance = useCountUp(dashboardStats?.attendancePercentage ?? 0);
const productivity = useCountUp(dashboardStats?.productivity ?? 0);
const monthlyHours = useCountUp(dashboardStats?.monthlyHours ?? 0);

  const goals = [
    {
      label: "Weekly Hours",
      current: weeklyHours,
      target: dashboardStats?.weeklyTarget ?? 40,
      unit: "hrs",
      color: "#6366f1",
    },
    {
      label: "Attendance Rate",
      current: attendance,
      target: 100,
      unit: "%",
      color: "#10b981",
    },
   
    {
      label: "Productivity Score",
       current: productivity,
      target: 100,
      unit: "%",
      color: "#22d3ee",
    },
    {
      label: "Monthly Hours",
       current: monthlyHours,
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

