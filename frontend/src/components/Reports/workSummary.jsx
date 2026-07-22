import { SectionLabel } from "./sectionLabel";

export function WorkSummary({ summaryItems }) {
  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <SectionLabel>Work Summary</SectionLabel>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 13,
        }}
      >
        {summaryItems.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 10,
              padding: "12px 14px",
            }}
            className="workDiv"
          >
            <div
              style={{
                fontSize: 19,
                marginBottom: 4,
              }}
            >
              {item.icon}
            </div>

            <div
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 2,
              }}
            >
              {item.value}
            </div>

            <div
              style={{
                fontSize: 17,
                color: "#475569",
                textTransform: "capitalize",
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
