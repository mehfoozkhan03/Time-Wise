import { useState } from "react";

import { SectionLabel } from "./sectionLabel";
import { StatusPill } from "./statusPill";

export function AttendanceLog({
  attendanceLog,
  filteredLog,
  searchLog,
  statusFilter,
  onSearchChange,
  onStatusChange,
}) {
  const recordsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredLog.length / recordsPerPage);

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;

  const currentRecords = filteredLog.slice(startIndex, endIndex);

  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <SectionLabel>Attendance Log</SectionLabel>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 13,
                color: "#475569",
              }}
            >
              🔍
            </span>
            <input
              value={searchLog}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search dates or notes..."
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border)",
                borderRadius: 9,
                padding: "7px 12px 7px 30px",
                color: "#e8edf5",
                fontSize: 13,
                outline: "none",
                width: 200,
                fontFamily: "DM Sans, sans-serif",
              }}
            />
          </div>
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            style={{
              background: "var(--primary)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 9,
              padding: "7px 12px",
              color: "#fff",
              fontSize: 13,
              cursor: "pointer",
              outline: "none",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            <option value="all">All Statuses</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="absent">Absent</option>
            <option value="leave">Leave</option>
            <option value="holiday">Holiday</option>
          </select>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
          }}
        >
          <thead>
            <tr>
              {[
                "Date",
                "Check-in",
                "Check-out",
                "Working Hrs",
                "Break",
                "Overtime",
                "Status",
                "Notes",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    fontSize: 11,
                    color: "#475569",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    whiteSpace: "nowrap",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((row, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.035)",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.025)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td
                  style={{
                    padding: "12px 12px",
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                    fontWeight: 500,
                  }}
                >
                  {row.date}
                </td>
                <td
                  style={{
                    padding: "12px 12px",
                    color: "var(--text-primary)",
                    fontFamily: "JetBrains Mono, monospace",
                    fontWeight: 500,
                  }}
                >
                  {row.checkin}
                </td>
                <td
                  style={{
                    padding: "12px 12px",
                    color: "var(--text-primary)",
                    fontFamily: "JetBrains Mono, monospace",
                    fontWeight: 500,
                  }}
                >
                  {row.checkout}
                </td>
                <td style={{ padding: "12px 12px" }}>
                  {row.hours > 0 ? (
                    <span
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: 13,
                        fontWeight: 600,
                        color: row.hours >= 8 ? "#10b981" : "#f59e0b",
                      }}
                    >
                      {row.hours}h
                    </span>
                  ) : (
                    <span style={{ color: "#334155" }}>—</span>
                  )}
                </td>
                <td
                  style={{
                    padding: "12px 12px",
                    color: "var(--text-pimary)",
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 12,
                  }}
                >
                  {row.breakDuration}
                </td>
                <td style={{ padding: "12px 12px" }}>
                  {row.overtime > 0 ? (
                    <span
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: 12,
                        color: "#8b5cf6",
                        fontWeight: 600,
                      }}
                    >
                      +{row.overtime}h
                    </span>
                  ) : (
                    <span style={{ color: "#334155" }}>—</span>
                  )}
                </td>
                <td style={{ padding: "12px 12px" }}>
                  <StatusPill status={row.status} />
                </td>
                <td
                  style={{
                    padding: "12px 12px",
                    color: "#475569",
                    fontSize: 12,
                  }}
                >
                  {row.notes || "—"}
                </td>
              </tr>
            ))}
            {filteredLog.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    textAlign: "center",
                    padding: "32px",
                    color: "#334155",
                    fontSize: 13,
                  }}
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 16,
          paddingTop: 14,
        }}
      >
        <span style={{ fontSize: 12, color: "var(--text-primary)" }}>
          Showing {startIndex + 1} - {Math.min(endIndex, filteredLog.length)} of{" "}
          {filteredLog.length} records
        </span>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <button
            style={{
              background: "var(-primary)",
              color: "#fff",
              borderRadius: "5px",
              padding: "5px 11px",
            }}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Prev
          </button>
          <button
            style={{
              padding: "5px 11px",
              background: "var(-primary)",
              color: "#fff",
              borderRadius: "5px",
            }}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
