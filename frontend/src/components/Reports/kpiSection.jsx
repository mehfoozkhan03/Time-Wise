import { KPICard } from "./kpiCard";

export function KPISection({ sparklineData }) {
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
      <KPICard
        icon="📅"
        label="Attendance Rate"
        value="96"
        unit="%"
        trend={2.1}
        sparkData={sparklineData.attendance}
        sparkColor="#10b981"
        sub="22 of 23 working days"
      />

      <KPICard
        icon="🔥"
        label="Current Streak"
        value="18"
        unit="days"
        trend={4}
        trendSuffix=" days"
        sparkData={sparklineData.streak}
        sparkColor="#f59e0b"
        sub="Personal best this year"
      />

      <KPICard
        icon="🕐"
        label="Total Working hrs"
        value="169"
        unit="h"
        trend={5.8}
        trendSuffix="h"
        sparkData={sparklineData.hours}
        sparkColor="#6366f1"
        sub="Jul 2026"
      />

      <KPICard
        icon="⏱"
        label="Avg Daily Hours"
        value="8.4"
        unit="h/day"
        trend={0.3}
        trendSuffix="h"
        sparkData={sparklineData.daily}
        sparkColor="#22d3ee"
        sub="Target: 8.0h"
      />

      <KPICard
        icon="💪"
        label="Overtime Hours"
        value="4.5"
        unit="h"
        trend={1.2}
        trendSuffix="h"
        sparkData={sparklineData.overtime}
        sparkColor="#8b5cf6"
        sub="This month"
      />

      <KPICard
        icon="⚡"
        label="Productivity Score"
        value="94"
        unit="pts"
        trend={7}
        sparkData={sparklineData.productivity}
        sparkColor="#6366f1"
        sub="Top 15% in team"
      />

      <KPICard
        icon="🌴"
        label="Leaves Taken"
        value="5"
        unit="days"
        trend={-1}
        sparkData={sparklineData.leaves}
        sparkColor="#ef4444"
        sub="8 days remaining"
      />

      <KPICard
        icon="🕗"
        label="Avg Check-in Time"
        value="08:42"
        trend={-12}
        trendSuffix=" min"
        sparkData={sparklineData.checkin}
        sparkColor="#22d3ee"
        sub="12 min earlier vs last mo."
      />
    </div>
  );
}
