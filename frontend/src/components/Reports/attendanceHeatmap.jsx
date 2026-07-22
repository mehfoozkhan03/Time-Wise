import { statusConfig } from "./statusConfig";

export function AttendanceHeatmap({ calendarData = [] }) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // July 2026 starts on Wednesday
  const startOffset = 3;

  const cellColor = {
    present: "#10b981",
    late: "#f59e0b",
    absent: "#ef4444",
    leave: "#6366f1",
    holiday: "#22d3ee",
    weekend: "#1a2035",
  };

  const cells = [...Array(startOffset).fill(null), ...calendarData];

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 3,
          marginBottom: 6,
        }}
      >
        {days.map((day) => (
          <div
            key={day}
            style={{
              fontSize: 10,
              color: "#475569",
              textAlign: "center",
              fontWeight: 600,
              letterSpacing: "0.06em",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 3,
        }}
      >
        {cells.map((cell, index) => (
          <div
            key={index}
            title={
              cell ? `${cell.day} Jul — ${statusConfig[cell.status].label}` : ""
            }
            style={{
              aspectRatio: "1",
              borderRadius: 5,
              background: cell
                ? cellColor[cell.status] +
                  (cell.status === "weekend" ? "" : "22")
                : "transparent",
              border:
                cell && cell.status !== "weekend"
                  ? `1px solid ${cellColor[cell.status]}44`
                  : "1px solid transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 500,
              color:
                cell?.status === "weekend"
                  ? "#1e2d4a"
                  : cellColor[cell?.status || "present"] + "dd",
              cursor: "default",
              transition: "transform 0.15s",
            }}
          >
            {cell?.day}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 14,
          marginTop: 14,
          flexWrap: "wrap",
        }}
      >
        {Object.entries(statusConfig)
          .filter(([key]) => key !== "weekend")
          .map(([key, value]) => (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: value.dot,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: "#64748b",
                }}
              >
                {value.label}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
