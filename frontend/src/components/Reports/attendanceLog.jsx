import { SectionLabel } from "./sectionLabel";
import { StatusPill } from "./statusPill";
import { useState } from "react";
import Skeleton from "../../components/Skeleton/Skeleton";
import { formatHours } from "./formatHours";
import CustomSelect from "../../components/Common/CustomSelect/CustomSelect";

export function AttendanceLog({
  filteredLog,
  searchLog,
  statusFilter,
  onSearchChange,
  onStatusChange,
  isLoading = false,
}) {
  const recordsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredLog.length / recordsPerPage);

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;

  const currentRecords = filteredLog.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="glass-card" style={{ padding: 24 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <Skeleton width="180px" height="30px" />

          <div style={{ display: "flex", gap: 10 }}>
            <Skeleton width="220px" height="40px" />
            <Skeleton width="150px" height="40px" />
          </div>
        </div>

        {/* Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              {[...Array(8)].map((_, i) => (
                <th key={i} style={{ padding: "10px" }}>
                  <Skeleton height="18px" />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {[...Array(5)].map((_, row) => (
              <tr key={row}>
                {[...Array(8)].map((_, col) => (
                  <td key={col} style={{ padding: "12px" }}>
                    <Skeleton height="18px" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
            alignItems: "center",
          }}
        >
          <Skeleton width="180px" height="18px" />

          <div style={{ display: "flex", gap: 15 }}>
            <Skeleton width="90px" height="35px" />
            <Skeleton width="90px" height="35px" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <div
        className="reports-attendance-header"
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
        <div
          className="reports-attendance-controls"
          style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
        >
          {/* Search */}
          <div className="reports-search-wrapper">
            <span className="reports-search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              className="reports-search-input"
              value={searchLog}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search date, status, time, or notes..."
              aria-label="Search attendance records by date, status, time, hours, break, overtime, or notes"
            />
          </div>
          {/* Status filter */}
          <div className="reports-status-select">
            <CustomSelect
              id="reports-attendance-status-filter"
              name="attendance-status"
              value={statusFilter}
              onChange={(event) => onStatusChange(event.target.value)}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "present", label: "Present" },
                { value: "late", label: "Late" },
                { value: "absent", label: "Absent" },
                { value: "leave", label: "Leave" },
              ]}
            />
          </div>
        </div>
      </div>
      <div style={{ overflowX: "scroll", scrollbarWidth: "none" }}>
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
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    whiteSpace: "nowrap",
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
                    fontWeight: 500,
                  }}
                >
                  {row.checkin}
                </td>
                <td
                  style={{
                    padding: "12px 12px",
                    color: "var(--text-primary)",
                    fontWeight: 500,
                  }}
                >
                  {row.checkout}
                </td>
                <td style={{ padding: "12px 12px" }}>
                  {row.hours > 0 ? (
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: row.hours >= 8 ? "#10b981" : "#f59e0b",
                      }}
                    >
                      {formatHours(row.hours)}h
                    </span>
                  ) : (
                    <span style={{ color: "var(--text-primary)" }}>0h</span>
                  )}
                </td>
                <td
                  style={{
                    padding: "12px 12px",
                    color: "var(--text-pimary)",
                    fontSize: 12,
                  }}
                >
                  {row.breakDuration}
                </td>
                <td style={{ padding: "12px 12px" }}>
                  {row.overtime > 0 ? (
                    <span
                      style={{
                        fontSize: 12,
                        color: "#8b5cf6",
                        fontWeight: 600,
                      }}
                    >
                      +{formatHours(row.overtime)}h
                    </span>
                  ) : (
                    <span style={{ color: "var(--text-primary)" }}>—</span>
                  )}
                </td>
                <td style={{ padding: "12px 12px" }}>
                  <StatusPill status={row.status} />
                </td>
                <td
                  style={{
                    padding: "12px 12px",
                    color: "var(--text-primary)",
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
                    color: "var(--text-primary)",
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
              background: "var(--primary)",
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
              background: "var(--primary)",
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
