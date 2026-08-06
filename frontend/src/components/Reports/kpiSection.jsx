// import { KPICard } from './kpiCard';
// import useCountUp from '../../components/UseCount/Count';

// export function KPISection({
//   sparklineData,
//   dashboardStats = {},
//   kpiMetrics = {},
// }) {
//   const attendance = useCountUp(dashboardStats?.attendancePercentage || 0);
//   const dayStreak = useCountUp(dashboardStats?.dayStreak || 0);
//   const monthlyHours = useCountUp(dashboardStats?.monthlyHours || 0);
//   const productivity = useCountUp(dashboardStats?.productivity || 0);
//   return (
//     <div
//       className="stagger"
//       style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(4,1fr)',
//         gap: 14,
//         marginBottom: 28,
//       }}
//     >
//       <KPICard
//         icon="📅"
//         label="Attendance Rate"
//         value={attendance}
//         unit="%"
//         trend={kpiMetrics?.attendanceTrend ?? 0}
//         sparkData={sparklineData.attendance}
//         sparkColor="#10b981"
//         sub={`${dashboardStats.attendancePercentage}% attendance`}
//       />

//       <KPICard
//         icon="🔥"
//         label="Current Streak"
//         value={dayStreak}
//         unit="days"
//         trend={kpiMetrics?.streakTrend ?? 0}
//         trendSuffix=" days"
//         sparkData={sparklineData.streak}
//         sparkColor="#f59e0b"
//         sub={`Best: ${dashboardStats.longestStreak} days`}
//       />

//       <KPICard
//         icon="🕐"
//         label="Total Working hrs"
//         value={monthlyHours.toFixed(1)}
//         unit="h"
//         trend={kpiMetrics?.monthlyHoursTrend ?? 0}
//         trendSuffix="h"
//         sparkData={sparklineData.hours}
//         sparkColor="#6366f1"
//         sub="This Month"
//       />

//       <KPICard
//         icon="⏱"
//         label="Avg Daily Hours"
//         value={kpiMetrics.averageDailyHours ?? 0}
//         unit="h/day"
//         trend={kpiMetrics?.monthlyHoursTrend ?? 0}
//         trendSuffix="h"
//         sparkData={sparklineData.daily}
//         sparkColor="#22d3ee"
//         sub="Target: 8.0h"
//       />

//       <KPICard
//         icon="💪"
//         label="Overtime Hours"
//         value={kpiMetrics.overtimeHours ?? 0}
//         unit="h"
//         trend={kpiMetrics?.overtimeTrend ?? 0}
//         trendSuffix="h"
//         sparkData={sparklineData.overtime}
//         sparkColor="#8b5cf6"
//         sub="This month"
//       />
//       <KPICard
//         icon="⚡"
//         label="Productivity Score"
//         value={productivity}
//         unit="%"
//         trend={kpiMetrics?.productivityTrend ?? 0}
//         sparkData={sparklineData.productivity}
//         sparkColor="#6366f1"
//         sub={`${dashboardStats.punctuality}% punctuality`}
//       />

//       <KPICard
//         icon="🌴"
//         label="Leaves Taken"
//         value={kpiMetrics.leavesTaken ?? 0}
//         unit="days"
//         trend={kpiMetrics?.leaveTrend ?? 0}
//         sparkData={sparklineData.leaves}
//         sparkColor="#ef4444"
//         sub="8 days remaining"
//       />

//       <KPICard
//         icon="🕗"
//         label="Avg Check-in Time"
//         value={dashboardStats.averageCheckIn}
//         trend={kpiMetrics?.checkInTrend ?? 0}
//         trendSuffix=" min"
//         sparkData={sparklineData.checkin}
//         sparkColor="#22d3ee"
//         sub={`Avg Break: ${dashboardStats.averageBreakDuration} min`}
//       />
//     </div>
//   );
// }


import { KPICard } from './kpiCard';
import useCountUp from '../../components/UseCount/Count';
import { useState, useEffect } from "react";
import Skeleton from "../../components/Skeleton/Skeleton";

export function KPISection({
  sparklineData,
  dashboardStats = {},
  kpiMetrics = {},
}) {
  const attendance = useCountUp(dashboardStats?.attendancePercentage || 0);
  const dayStreak = useCountUp(dashboardStats?.dayStreak || 0);
  const monthlyHours = useCountUp(dashboardStats?.monthlyHours || 0);
  const productivity = useCountUp(dashboardStats?.productivity || 0);

  const [showSkeleton, setShowSkeleton] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setShowSkeleton(false);
  }, 1500);

  return () => clearTimeout(timer);
}, []);

  return (
  <div
    className="stagger"
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 14,
      marginBottom: 28,
    }}
  >
    {showSkeleton
      ? [...Array(8)].map((_, index) => (
          <div
            key={index}
            style={{
              padding: 18,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <Skeleton width="40px" height="40px" radius="50%" />

            <Skeleton width="120px" height="16px" />

            <Skeleton width="90px" height="30px" />

            <Skeleton width="100%" height="40px" radius="6px" />

            <Skeleton width="80px" height="14px" />
          </div>
        ))
      : (
        <>
          <KPICard
            icon="📅"
            label="Attendance Rate"
            value={attendance}
            unit="%"
            trend={kpiMetrics?.attendanceTrend ?? 0}
            sparkData={sparklineData?.attendance}
            sparkColor="#10b981"
            sub={`${dashboardStats.attendancePercentage}% attendance`}
          />

          <KPICard
            icon="🔥"
            label="Current Streak"
            value={dayStreak}
            unit="days"
            trend={kpiMetrics?.streakTrend ?? 0}
            trendSuffix=" days"
            sparkData={sparklineData?.streak}
            sparkColor="#f59e0b"
            sub={`Best: ${dashboardStats.longestStreak} days`}
          />

          <KPICard
            icon="🕐"
            label="Total Working hrs"
            value={(monthlyHours || 0).toFixed(1)}
            unit="h"
            trend={kpiMetrics?.monthlyHoursTrend ?? 0}
            trendSuffix="h"
            sparkData={sparklineData?.hours}
            sparkColor="#6366f1"
            sub="This Month"
          />

          <KPICard
            icon="⏱"
            label="Avg Daily Hours"
            value={kpiMetrics?.averageDailyHours ?? 0}
            unit="h/day"
            trend={kpiMetrics?.monthlyHoursTrend ?? 0}
            trendSuffix="h"
            sparkData={sparklineData?.daily}
            sparkColor="#22d3ee"
            sub="Target: 8.0h"
          />

          <KPICard
            icon="💪"
            label="Overtime Hours"
            value={kpiMetrics?.overtimeHours ?? 0}
            unit="h"
            trend={kpiMetrics?.overtimeTrend ?? 0}
            trendSuffix="h"
            sparkData={sparklineData?.overtime}
            sparkColor="#8b5cf6"
            sub="This month"
          />

          <KPICard
            icon="⚡"
            label="Productivity Score"
            value={productivity}
            unit="%"
            trend={kpiMetrics?.productivityTrend ?? 0}
            sparkData={sparklineData?.productivity}
            sparkColor="#6366f1"
            sub={`${dashboardStats.punctuality}% punctuality`}
          />

          <KPICard
            icon="🌴"
            label="Leaves Taken"
            value={kpiMetrics?.leavesTaken ?? 0}
            unit="days"
            trend={kpiMetrics?.leaveTrend ?? 0}
            sparkData={sparklineData?.leaves}
            sparkColor="#ef4444"
            sub="8 days remaining"
          />

          <KPICard
            icon="🕗"
            label="Avg Check-in Time"
            value={dashboardStats?.averageCheckIn || "--"}
            trend={kpiMetrics?.checkInTrend ?? 0}
            trendSuffix=" min"
            sparkData={sparklineData?.checkin}
            sparkColor="#22d3ee"
            sub={`Avg Break: ${dashboardStats?.averageBreakDuration || 0} min`}
          />
        </>
      )}
  </div>
);
}
