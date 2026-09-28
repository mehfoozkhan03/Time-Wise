import Skeleton from "../../components/Skeleton/Skeleton";
import { statusConfig } from "./statusConfig";

export function AttendanceHeatmap({ calendarData = [], isLoading = false }) {

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDate = calendarData[0]?.date;
  const [year, month, day] = (firstDate || "").split("-").map(Number);
  const startOffset = firstDate ? new Date(year, month - 1, day).getDay() : 0;
  const cells = [...Array(startOffset).fill(null), ...calendarData];
  
  if (isLoading) {
  return (
    <div>

      {/* Week Days */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 3,
          marginBottom: 6,
        }}
      >
        {[...Array(7)].map((_, i) => (
          <Skeleton
            key={i}
            width="100%"
            height="18px"
          />
        ))}
      </div>

      {/* Calendar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 3,
        }}
      >
        {[...Array(Math.max(35, Math.ceil(cells.length / 7) * 7))].map((_, i) => (
          <Skeleton
            key={i}
            width="100%"
            height="42px"
            radius="5px"
          />
        ))}
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 14,
          marginTop: 14,
          flexWrap: "wrap",
        }}
      >
        {[...Array(5)].map((_, i) => (
          <Skeleton
            key={i}
            width="70px"
            height="15px"
          />
        ))}
      </div>

    </div>
  );
}
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
            title={!cell ? "" : `${cell.date} — ${statusConfig[cell.status]?.label || cell.status}`}
            style={{
              aspectRatio: "1",
              borderRadius: 5,
              background: cell
                ? cell.status === "inactive" || cell.status === "weekend"
                  ? statusConfig[cell.status]?.bg
                  : statusConfig[cell.status]?.dot || "transparent"
                : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 500,
              color: cell ? statusConfig[cell.status]?.text || "#000" : "#000",
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
