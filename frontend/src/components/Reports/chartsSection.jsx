

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

import { SectionLabel } from "./sectionLabel";
import { CustomTooltip } from "./CustomTooltip";
import { AttendanceHeatmap } from "./attendanceHeatmap";
import useCountUp from "../../components/UseCount/Count";
import Skeleton from "../../components/Skeleton/Skeleton";
import { roundHours } from "./formatHours";

function EmptyChart({ message = "No data available" }) {
  return (
    <div
      style={{
        height: 280,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        color: "var(--text-secondary)",
      }}
    >
      <div style={{ fontSize: 50 }}>📊</div>

      <h3 style={{ margin: 0 }}>No data available</h3>

      <p
        style={{
          margin: 0,
          fontSize: 14,
          opacity: 0.8,
        }}
      >
        {message}
      </p>
    </div>
  );
}

export function ChartsSection({
  activeTab,
  chartTabs,
  setTab,
  attendanceLog,
  dashboardStats,
  calendarData = [],
  rangeLabel = "Selected range",
  isLoading = false,
}) {
  const productivity = useCountUp(
    activeTab === "productivity" ? (dashboardStats?.productivity ?? 0) : 0,
  );

  const records = attendanceLog ?? [];
  const dateKey = (item) => item.dateKey;
  const formatDateLabel = (key) => {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const dynamicDailyHoursData = records.map((item) => ({
    day: formatDateLabel(dateKey(item)),
    hours: roundHours((item.totalWorkingSeconds || 0) / 3600),
    target: 8,
  }));

  const weeklyMap = new Map();
  records.forEach((item) => {
    const key = dateKey(item);
    const [year, month, day] = key.split("-").map(Number);
    const start = new Date(year, month - 1, day);
    const weekday = start.getDay();
    start.setDate(start.getDate() + (weekday === 0 ? -6 : 1 - weekday));
    const weekKey = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
    const week = weeklyMap.get(weekKey) || {
      week: formatDateLabel(weekKey),
      actual: 0,
      target: 40,
    };
    week.actual += (item.totalWorkingSeconds || 0) / 3600;
    weeklyMap.set(weekKey, week);
  });

  const dynamicWeeklyData = [...weeklyMap.values()].map((week) => ({
    ...week,
    actual: roundHours(week.actual),
  }));

  const statusCount = {
    present: 0,
    late: 0,
    absent: 0,
    leave: 0,
    holiday: 0,
    "half day": 0,
  };

  calendarData.forEach((item) => {
    const status = String(item.status || "").toLowerCase();
    if (Object.hasOwn(statusCount, status)) statusCount[status] += 1;
  });

  const dynamicAttendanceDistribution = [
    {
      name: "Present",
      value: statusCount.present,
      color: "#10b981",
    },
    {
      name: "Late",
      value: statusCount.late,
      color: "#f59e0b",
    },
    {
      name: "Absent",
      value: statusCount.absent,
      color: "#ef4444",
    },
    {
      name: "Leave",
      value: statusCount.leave,
      color: "#3b82f6",
    },
    {
      name: "Holiday",
      value: statusCount.holiday,
      color: "#8b5cf6",
    },
    {
      name: "Half Day",
      value: statusCount["half day"],
      color: "#06b6d4",
    },
  ].filter((item) => item.value > 0);

  const hasDailyData = dynamicDailyHoursData.some((item) => item.hours > 0);

  const hasWeeklyData = dynamicWeeklyData.some((item) => item.actual > 0);

  const hasAttendanceData = dynamicAttendanceDistribution.length > 0;

  const hasProductivityData = (dashboardStats?.productivity ?? 0) > 0;

  const hasHeatmapData = calendarData.length > 0;
  const showSkeleton = isLoading;

  return (
    <div
      className="glass-card"
      style={{
        marginBottom: 20,
      }}
    >
      {/* Tab Bar */}

      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "10px 20px",
          gap: 10,
        }}
        className="chartDiv"
      >
        {showSkeleton
          ? [...Array(5)].map((_, i) => (
              <Skeleton key={i} width="120px" height="36px" radius="8px" />
            ))
          : chartTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                style={{
                  padding: "14px 16px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  borderBottom:
                    activeTab === tab.id
                      ? "2px solid var(--primary)"
                      : "2px solid transparent",
                  marginBottom: -1,
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                }}
              >
                {tab.label}
              </button>
            ))}
      </div>

      <div style={{ padding: 24 }}>
        {/* ---------------- DAILY HOURS ---------------- */}
        {activeTab === "hours" && (
          <div>
            {showSkeleton ? (
              <Skeleton
                width="260px"
                height="22px"
                radius="6px"
                style={{ marginBottom: "20px" }}
              />
            ) : (
              <SectionLabel>Daily Working Hours — {rangeLabel}</SectionLabel>
            )}
            {hasDailyData ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={dynamicDailyHoursData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                  />

                  <XAxis
                    dataKey="day"
                    tick={{
                      fill: "#475569",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fill: "#475569",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <ReferenceLine
                    y={8}
                    stroke="#6366f133"
                    strokeDasharray="4 4"
                    label={{
                      value: "Target",
                      fill: "#475569",
                      fontSize: 10,
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="hours"
                    name="Hours"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#hoursGrad)"
                    dot={{ fill: "#6366f1", r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "#818cf8" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No daily working hours available." />
            )}{" "}
          </div>
        )}

        {/* ---------------- WEEKLY HOURS ---------------- */}
        {activeTab === "weekly" && (
          <div>
            <SectionLabel>Weekly Hours vs Target — {rangeLabel}</SectionLabel>

            {hasWeeklyData ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={dynamicWeeklyData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                  />
                  <XAxis
                    dataKey="week"
                    tick={{
                      fill: "#475569",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[35, 48]}
                    tick={{
                      fill: "#475569",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "var(--success)" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar
                    dataKey="actual"
                    name="Actual"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="target"
                    name="Target"
                    fill="var(--text_primary)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No weekly hours available." />
            )}
          </div>
        )}

        {/* ---------------- ATTENDANCE HEATMAP ---------------- */}
        {activeTab === "heatmap" && (
          <div>
            <SectionLabel>Attendance Calendar — {rangeLabel}</SectionLabel>

            {hasHeatmapData ? (
              <AttendanceHeatmap
                calendarData={calendarData}
                isLoading={isLoading}
              />
            ) : (
              <EmptyChart message="No attendance records found." />
            )}
          </div>
        )}

        {/* ---------------- DONUT CHART ---------------- */}
        {activeTab === "donut" && (
          <div>
            <SectionLabel>Attendance Distribution — {rangeLabel}</SectionLabel>

            {hasAttendanceData ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 40,
                  flexWrap: "wrap",
                }}
              >
                <ResponsiveContainer width={240} height={240}>
                  <PieChart>
                    <Pie
                      data={dynamicAttendanceDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={68}
                      outerRadius={105}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {dynamicAttendanceDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(v) => [`${v} days`, ""]}
                      contentStyle={{
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 10,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    flex: 1,
                  }}
                >
                  {dynamicAttendanceDistribution.map((item) => (
                    <div
                      key={item.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 3,
                          background: item.color,
                          flexShrink: 0,
                        }}
                      />

                      <span
                        style={{
                          fontSize: 13.5,
                          flex: 1,
                        }}
                      >
                        {item.name}
                      </span>

                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {item.value}
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 400,
                          }}
                        >
                          {" "}
                          days
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyChart message="No attendance distribution available." />
            )}
          </div>
        )}

        {/* ---------------- PRODUCTIVITY ---------------- */}
        {activeTab === "productivity" && (
          <div>
            <SectionLabel>Productivity Score</SectionLabel>

            {hasProductivityData ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "40px 0",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 220,
                    height: 220,
                  }}
                >
                  <svg width="220" height="220">
                    <circle
                      cx="110"
                      cy="110"
                      r="90"
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="14"
                    />

                    <circle
                      cx="110"
                      cy="110"
                      r="90"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 90}
                      strokeDashoffset={
                        (2 * Math.PI * 90 * (100 - productivity)) / 100
                      }
                      transform="rotate(-90 110 110)"
                      style={{
                        transition: "stroke-dashoffset .6s ease",
                      }}
                    />
                  </svg>

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 42,
                        fontWeight: 700,
                      }}
                    >
                      {productivity}%
                    </div>

                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 14,
                        color: "#64748b",
                      }}
                    >
                      Productivity
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyChart message="No productivity data available." />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
