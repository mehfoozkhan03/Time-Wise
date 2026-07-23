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
import { AttendanceHeatmap } from "./AttendanceHeatmap";
import {
  dailyHoursData,
  weeklyData,
  attendanceDistribution,
  productivityData,
  calendarData,
} from "./chartData";

export function ChartsSection({ activeTab, chartTabs, setTab }) {
  return (
    <div
      className="glass-card"
      style={{
        marginBottom: 20,
        overflow: "hidden",
      }}
    >
      {/* Tab Bar */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "0 20px",
          gap: 2,
          overflowX: "hidden",
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
                data={dailyHoursData}
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
                  domain={[6, 11]}
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
                data={weeklyData}
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
                <Tooltip content={<CustomTooltip />} cursor={{fill:"var(--success)"}} />
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

            <AttendanceHeatmap calendarData={calendarData} />
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
                    data={attendanceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={105}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {attendanceDistribution.map((entry, i) => (
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
                {attendanceDistribution.map((item) => (
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
            <SectionLabel>Productivity Trend vs Team Average</SectionLabel>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={productivityData}
                margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                />

                <XAxis
                  dataKey="week"
                  tick={{
                    fontSize: 11,
                    fontFamily: "JetBrains Mono",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[70, 100]}
                  tick={{
                    fontSize: 11,
                    fontFamily: "JetBrains Mono",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip content={<CustomTooltip />} />

                <Legend wrapperStyle={{ fontSize: 12 }} />

                <Line
                  type="monotone"
                  dataKey="score"
                  name="Your Score"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#818cf8" }}
                />

                <Line
                  type="monotone"
                  dataKey="avg"
                  name="Team Avg"
                  stroke="#334155"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
