import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
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

export function ChartsSection({
  activeTab,
  chartTabs,
  setTab,
  attendanceLog,
  dashboardStats,
}) {
  // console.log("Attendance Log:", attendanceLog);

  const filtered = (attendanceLog ?? []).filter(
    (item) => item.status !== "Holiday",
  );

  // console.log("Filtered:", filtered);

  const dynamicDailyHoursData = filtered.map((item) => ({
    day: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    hours: Number((item.totalWorkingSeconds / 3600).toFixed(1)),
    target: 8,
  }));

  // console.log("Chart Data:", dynamicDailyHoursData);

  // console.log(dynamicDailyHoursData);

  const weeklyMap = {};

  (attendanceLog ?? []).forEach((item) => {
    const date = new Date(item.date);

    const month = date.toLocaleString("en-US", {
      month: "short",
    });

    const weekNumber = Math.ceil(date.getDate() / 7);
    const weekLabel = `${month} W${weekNumber}`;

    if (!weeklyMap[weekLabel]) {
      weeklyMap[weekLabel] = {
        week: weekLabel,
        actual: 0,
        target: 40,
      };
    }

    weeklyMap[weekLabel].actual += item.totalWorkingSeconds / 3600;
  });

  const dynamicWeeklyData = Object.values(weeklyMap).map((week) => ({
    ...week,
    actual: Number(week.actual.toFixed(1)),
  }));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const records = attendanceLog ?? [];

  // Find the employee's first attendance day
  const firstAttendanceDate =
    records.length > 0
      ? new Date(
          Math.min(...records.map((item) => new Date(item.date).getTime())),
        )
      : null;

  if (firstAttendanceDate) {
    firstAttendanceDate.setHours(0, 0, 0, 0);
  }

  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0 = Jan

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const attendanceMap = new Map();

  records.forEach((item) => {
    const date = new Date(item.date);

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    attendanceMap.set(key, item); // YYYY-MM-DD
  });

  const statusCount = {
    present: 0,
    late: 0,
    absent: 0,
    leave: 0,
    holiday: 0,
    "half day": 0,
  };

  (records ?? []).forEach((item) => {
    const status = item.status.toLowerCase();

    if (statusCount.hasOwnProperty(status)) {
      statusCount[status]++;
    }
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

  const dynamicCalendarData = Array.from(
    { length: daysInMonth },
    (_, index) => {
      const day = index + 1;

      const currentDate = new Date(currentYear, currentMonth, day);
      currentDate.setHours(0, 0, 0, 0);

      const isWeekend =
        currentDate.getDay() === 0 || currentDate.getDay() === 6;

      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      const attendance = attendanceMap.get(dateKey);

      // console.log({
      //   dateKey,
      //   attendance: attendanceMap.get(dateKey),
      // });

      // Weekend always stays weekend
      if (isWeekend) {
        return {
          day,
          status: "weekend",
        };
      }

      if (attendance) {
        return {
          day,
          status: attendance.status.toLowerCase(),
        };
      }

      // Before employee joined
      if (firstAttendanceDate && currentDate < firstAttendanceDate) {
        return {
          day,
          status: "inactive",
        };
      }

      // Future weekdays
      if (currentDate > today) {
        return {
          day,
          status: "inactive",
        };
      }

      // Missing weekday between joining and today
      return {
        day,
        status: "absent",
      };
    },
  );

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
          padding: "0 20px",
          gap: 2,
        }}
        className="chartDiv"
      >
        {chartTabs.map((tab) => (
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
                  ? "2px solid #6366f1"
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
            <SectionLabel>Daily Working Hours — July 2026</SectionLabel>

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
                    fontFamily: "JetBrains Mono",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fill: "#475569",
                    fontSize: 11,
                    fontFamily: "JetBrains Mono",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip content={<CustomTooltip />} />

                <ReferenceLine
                  y={8}
                  stroke="#6366f133"
                  strokeDasharray="4 4"
                  label={{ value: "Target", fill: "#475569", fontSize: 10 }}
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
          </div>
        )}

        {/* ---------------- WEEKLY HOURS ---------------- */}
        {activeTab === "weekly" && (
          <div>
            <SectionLabel>Weekly Hours vs Target — Last 8 Weeks</SectionLabel>

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
                    fontFamily: "JetBrains Mono",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[35, 48]}
                  tick={{
                    fill: "#475569",
                    fontSize: 11,
                    fontFamily: "JetBrains Mono",
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
          </div>
        )}

        {/* ---------------- ATTENDANCE HEATMAP ---------------- */}
        {activeTab === "heatmap" && (
          <div>
            <SectionLabel>Attendance Calendar — July 2026</SectionLabel>

            <AttendanceHeatmap
              calendarData={dynamicCalendarData}
              year={currentYear}
              month={currentMonth}
            />
          </div>
        )}

        {/* ---------------- DONUT CHART ---------------- */}
        {activeTab === "donut" && (
          <div>
            <SectionLabel>Attendance Distribution — July 2026</SectionLabel>

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
                  minWidth: 200,
                }}
              >
                {dynamicAttendanceDistribution.map((item) => (
                  <div
                    key={item.name}
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
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

                    <span style={{ fontSize: 13.5, flex: 1 }}>{item.name}</span>

                    <span
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
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
          </div>
        )}

        {/* ---------------- PRODUCTIVITY ---------------- */}
        {activeTab === "productivity" && (
          <div>
            <SectionLabel>Productivity Score</SectionLabel>

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
                  {/* Background Circle */}
                  <circle
                    cx="110"
                    cy="110"
                    r="90"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="14"
                  />

                  {/* Progress Circle */}
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
                      (2 *
                        Math.PI *
                        90 *
                        (100 - dashboardStats?.productivity ?? 0)) /
                      100
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
                    {dashboardStats?.productivity ?? 0}%
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
          </div>
        )}
      </div>
    </div>
  );
}
