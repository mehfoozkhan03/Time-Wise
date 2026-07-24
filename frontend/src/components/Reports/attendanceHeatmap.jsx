import { statusConfig } from "./statusConfig";

export function AttendanceHeatmap({ calendarData = [], year, month }) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // July 2026 starts on Wednesday
  const startOffset = new Date(year, month, 1).getDay();

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
              !cell
                ? ""
                : cell.status === "inactive"
                  ? `${cell.day} ${new Date(year, month).toLocaleString(
                      "en-US",
                      {
                        month: "short",
                      },
                    )}`
                  : `${cell.day} ${new Date(year, month).toLocaleString(
                      "en-US",
                      {
                        month: "short",
                      },
                    )} — ${statusConfig[cell.status].label}`
            }
            style={{
              aspectRatio: "1",
              borderRadius: 5,
              background: cell
                ? cell.status === "inactive" || cell.status === "weekend"
                  ? statusConfig[cell.status].bg
                  : `${statusConfig[cell.status].dot}`
                : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 500,
              color: cell ? statusConfig[cell.status].text : "#000",
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
          .filter(([key]) => key !== "inactive")
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
