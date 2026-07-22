import { useDispatch } from "react-redux";
import { setDateRange } from "../../store/reportsSlice";

export function ReportsHeader({ dateRange, ranges }) {
  const dispatch = useDispatch();

  return (
    <div
      style={{
        padding: "36px 0 28px",
        display: "flex",
        flexWrap: "wrap",
        gap: 20,
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              boxShadow: "0 4px 14px rgba(99,102,241,.4)",
            }}
          >
            📊
          </div>

          <h1
            style={{
              margin: 0,
              fontFamily: "Outfit,sans-serif",
              fontSize: 26,
              fontWeight: 700,
              color: "#e8edf5",
              letterSpacing: "-0.02em",
            }}
          >
            My Reports
          </h1>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: "#64748b",
            maxWidth: 420,
          }}
        >
          Personal attendance, productivity & performance analytics — track your
          progress and celebrate achievements.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            background: "#0d1322",
            border: "1px solid rgba(255,255,255,.065)",
            borderRadius: 10,
            padding: 3,
            gap: 2,
          }}
        >
          {ranges.map((r) => (
            <button
              key={r.id}
              onClick={() => dispatch(setDateRange(r.id))}
              style={{
                padding: "6px 12px",
                borderRadius: 7,
                border: "none",
                cursor: "pointer",
                fontSize: 12.5,
                fontWeight: 500,
                background:
                  dateRange === r.id ? "rgba(99,102,241,.18)" : "transparent",
                color: dateRange === r.id ? "#818cf8" : "#64748b",
                transition: "all .15s",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 9,
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.08)",
            color: "#94a3b8",
            fontSize: 12.5,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          📄 PDF
        </button>

        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 9,
            background: "rgba(16,185,129,.08)",
            border: "1px solid rgba(16,185,129,.2)",
            color: "#10b981",
            fontSize: 12.5,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          📊 Excel
        </button>
      </div>
    </div>
  );
}
