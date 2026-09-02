
import { SectionLabel } from "./sectionLabel";
import { GoalProgress } from "./goalProgress";
import useCountUp from "../../components/UseCount/Count";
import { useState, useEffect } from "react";
import Skeleton from "../../components/Skeleton/Skeleton";

export function GoalsSection({ dashboardStats }) {
  // console.log("Goals dashboardStats:", dashboardStats);
  const weeklyHours = useCountUp(dashboardStats?.weeklyHours ?? 0);
  const attendance = useCountUp(dashboardStats?.attendancePercentage ?? 0);
  const productivity = useCountUp(dashboardStats?.productivity ?? 0);
  const monthlyHours = useCountUp(dashboardStats?.monthlyHours ?? 0);

  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

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
      {showSkeleton ? (
        <div style={{ marginBottom: 20 }}>
          <Skeleton width="170px" height="24px" />
        </div>
      ) : (
        <SectionLabel>Goals & Targets</SectionLabel>
      )}

      {showSkeleton
        ? [...Array(4)].map((_, index) => (
            <div
              key={index}
              style={{
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                {/* Weekly Hours */}
                <Skeleton width="120px" height="16px" />

                {/* 20 / 40 hrs */}
                <Skeleton width="80px" height="16px" />
              </div>
              {/* Progress Bar */}
              <Skeleton width="100%" height="10px" radius="10px" />{" "}
            </div>
          ))
        : goals.map((goal) => <GoalProgress key={goal.label} {...goal} />)}
    </div>
  );
}
