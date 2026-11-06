// import { FiDownload } from "react-icons/fi";

// import "./DataExport.css"


// export const DataExport = () => {


//     return (
//         <>
//             <div className="dataexport-container">
//                 <div className="dataexport-heading">
//                     <h2>Data & Export</h2>
//                     <p>Download your attendance records and generate reports.</p>
//                 </div>

//                 {/* export attendance data */}
//                 <div className="export-attendance-data">
//                     <div className="attendance-export-heading">
//                         <h3>Export attendance data</h3>
//                     </div>
//                     <div className="attendance-range-format">
//                         <div className="date-range">
//                             <div className="data-range-selection">
//                                 <label htmlFor="daterange">Date range</label>
//                                 <select>
//                                     <option value="this month">This month</option>
//                                     <option value="last month">Last month</option>
//                                     <option value="last three months">Last three months</option>
//                                     <option value="last year">Last year</option>
//                                     <option value="custom range">Custom range</option>
//                                 </select>
//                             </div>
//                             <div className="download-attendance">
//                                 <FiDownload className="download-icon" />
//                                 <button type="button">Download CSV</button>
//                             </div>
//                         </div>
//                         <div className="file-format">
//                             <label htmlFor="fileformat">File formate</label>
//                             <select>
//                                 <option value="CSV">CSV</option>
//                                 <option value="Excel">Excel (.xlsx)</option>
//                                 <option value="PDF">PDF</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Recent exports */}
//                 <div className="recent-export">
//                     <div className="recent-heading">
//                         <h3>Recent Export</h3>
//                     </div>
//                     <div className="recent-export-content">
//                         <div className="attendance-report">
//                             <div>
//                                 <h3>Attendance Report - June 2026</h3>
//                                 <p>June 30, 2026 · 48 KB</p>
//                             </div>
//                             <div className="download-container">
//                                 <FiDownload className="fidownload" />
//                                 <button type="button">Download</button>
//                             </div>
//                         </div>
//                         <div className="monthly-summary">
//                             <div>
//                                 <h3>Monthly Summary - June 2026</h3>
//                                 <p>June 30, 2026 · 61 KB</p>
//                             </div>
//                             <div className="download-container">
//                                 <FiDownload className="fidownload" />
//                                 <button type="button">Download</button>
//                             </div>
//                         </div>
//                         <div className="leave-balance-report">
//                             <div>
//                                 <h3>Leave Balance Report</h3>
//                                 <p>June 30, 2026 · 22 KB</p>
//                             </div>
//                             <div className="download-container">
//                                 <FiDownload className="fidownload" />
//                                 <button type="button">Download</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Data retention */}
//                 <div className="data-retention">
//                     <div className="retention-heading">
//                         <h3>Data retention</h3>
//                     </div>
//                     <div className="retention-content">
//                         <p>Your attendance data is retained for 7 years in compliance with labor regulations. You may request a full data export or deletion via your organization admin.</p>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

import { FiDownload } from "react-icons/fi";
import { useEffect, useState } from "react";

import "./DataExport.css";
import Skeleton from "../../../components/Skeleton/Skeleton";
import CustomSelect from "../../../components/Common/CustomSelect/CustomSelect";
import { getAttendanceReport } from "../../../services/reportsService";
import {
  buildReportExportData,
  exportReportCSV,
  exportReportExcel,
  exportReportPDF,
} from "../../Reports/reportExport";

const RANGE_LABELS = {
  week: "This Week",
  month: "This Month",
  lastmonth: "Last Month",
  year: "This Year",
  custom: "Custom Range",
};

const readRecentExports = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("timewise-attendance-exports") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

export const DataExport = () => {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [dateRange, setDateRange] = useState("month");
  const [fileFormat, setFileFormat] = useState("csv");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [exportNotice, setExportNotice] = useState("");
  const [recentExports, setRecentExports] = useState(readRecentExports);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const performExport = async (settings, trackExport = true) => {
    const { range, format, from = "", to = "" } = settings;
    if (range === "custom" && (!from || !to || from > to)) {
      setExportError("Choose a valid start and end date before exporting.");
      setExportNotice("");
      return;
    }

    setIsExporting(true);
    setExportError("");
    setExportNotice("");
    let printWindow = null;
    try {
      if (format === "pdf") {
        printWindow = window.open("", "_blank", "width=1000,height=800");
        if (!printWindow) throw new Error("Allow pop-ups to print or save this report as PDF.");
      }
      const reportData = await getAttendanceReport({ range, from, to });
      const rangeLabel = RANGE_LABELS[range] || "Selected Range";
      const report = buildReportExportData({
        rangeLabel,
        customStartDate: from,
        customEndDate: to,
        stats: reportData.stats,
        attendance: reportData.attendance || [],
        calendar: reportData.calendar || [],
        filteredAttendance: reportData.attendance || [],
      });

      if (format === "pdf") exportReportPDF(report, printWindow);
      else if (format === "excel") exportReportExcel(report);
      else exportReportCSV(report);

      const periodSlug = report.period.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
      const extension = format === "excel" ? "xls" : format;
      const entry = {
        id: `${Date.now()}`,
        fileName: `TimeWise-Attendance-${periodSlug}.${extension}`,
        createdAt: new Date().toISOString(),
        range,
        format,
        from,
        to,
      };
      if (trackExport) {
        setRecentExports((current) => {
          const next = [entry, ...current].slice(0, 5);
          try { localStorage.setItem("timewise-attendance-exports", JSON.stringify(next)); } catch { /* local history is optional */ }
          return next;
        });
        setExportNotice(`${format.toUpperCase()} attendance export downloaded.`);
      }
    } catch (error) {
      printWindow?.close();
      setExportError(error.response?.data?.message || error.message || "Unable to export attendance data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = () => performExport({
    range: dateRange,
    format: fileFormat,
    from: customStartDate,
    to: customEndDate,
  });

  // =========================
  // SKELETON UI
  // =========================

  if (showSkeleton) {
    return (
      <div className="dataexport-container">

        {/* Heading Skeleton */}
        <div className="dataexport-heading">
          <Skeleton width="200px" height="25px" />

          <div className="skeleton-heading-text">
            <Skeleton width="420px" height="15px" />
          </div>
        </div>

        {/* Export Attendance Skeleton */}
        <div className="export-attendance-data">

          <div className="attendance-export-heading">
            <Skeleton width="200px" height="20px" />
          </div>

          <div className="attendance-range-format">

            {/* Left Side */}
            <div className="date-range">

              <div className="data-range-selection">
                <Skeleton width="90px" height="15px" />

                <Skeleton width="200px" height="42px" radius="10px" />
              </div>
<div className="skeleton-download-attendance">
  <Skeleton width="150px" height="42px" radius="6px" />
</div>

            </div>

            {/* Right Side */}
            <div className="file-format">
              <Skeleton width="90px" height="15px" />

              <Skeleton width="200px" height="42px" radius="10px" />
            </div>

          </div>
        </div>

        {/* Recent Export Skeleton */}
        <div className="recent-export">

          <div className="recent-heading">
            <Skeleton width="150px" height="20px" />
          </div>

          <div className="recent-export-content">

            {[1, 2, 3].map((item) => (
              <div className="skeleton-export-row" key={item}>

                <div className="skeleton-export-info">
                  <Skeleton width="260px" height="18px" />

                  <Skeleton width="170px" height="14px" />
                </div>

                <Skeleton width="100px" height="35px" radius="6px" />

              </div>
            ))}

          </div>
        </div>

        {/* Data Retention Skeleton */}
        <div className="data-retention">

          <div className="retention-heading">
            <Skeleton width="130px" height="20px" />
          </div>

          <div className="retention-content skeleton-retention-content">
            <Skeleton width="100%" height="14px" />
            <Skeleton width="85%" height="14px" />
            <Skeleton width="65%" height="14px" />
          </div>

        </div>

      </div>
    );
  }

  // =========================
  // ORIGINAL UI
  // =========================

  return (
    <div className="dataexport-container">

      <div className="dataexport-heading">
        <h2>Data & Export</h2>
        <p>Download your attendance records and generate reports.</p>
      </div>

      {/* Export attendance data */}
      <div className="export-attendance-data">

        <div className="attendance-export-heading">
          <h3>Export attendance data</h3>
        </div>

        <div className="attendance-range-format">

          <div className="date-range">

            <div className="data-range-selection">
              <label htmlFor="attendance-export-range">Date range</label>

              <CustomSelect
                id="attendance-export-range"
                name="attendance-export-range"
                value={dateRange}
                onChange={(event) => setDateRange(event.target.value)}
                options={[
                  { value: "week", label: "This week" },
                  { value: "month", label: "This month" },
                  { value: "lastmonth", label: "Last month" },
                  { value: "year", label: "This year" },
                  { value: "custom", label: "Custom range" },
                ]}
              />
            </div>

            {dateRange === "custom" && (
              <div className="dataexport-custom-range">
                <label>From<input type="date" value={customStartDate} onChange={(event) => setCustomStartDate(event.target.value)} /></label>
                <label>To<input type="date" value={customEndDate} min={customStartDate || undefined} onChange={(event) => setCustomEndDate(event.target.value)} /></label>
              </div>
            )}

            <div className="download-attendance">
              <FiDownload className="download-icon" />
              <button type="button" onClick={handleExport} disabled={isExporting || (dateRange === "custom" && (!customStartDate || !customEndDate || customStartDate > customEndDate))}>
                {isExporting ? "Preparing export…" : `Download ${fileFormat === "excel" ? "Excel" : fileFormat.toUpperCase()}`}
              </button>
            </div>

          </div>

          <div className="file-format">
            <label htmlFor="attendance-export-format">File format</label>

            <CustomSelect
              id="attendance-export-format"
              name="attendance-export-format"
              value={fileFormat}
              onChange={(event) => setFileFormat(event.target.value)}
              options={[
                { value: "csv", label: "CSV (.csv)" },
                { value: "excel", label: "Excel (.xls)" },
                { value: "pdf", label: "PDF (.pdf)" },
              ]}
            />
          </div>

        </div>
        {exportError && <p className="dataexport-feedback dataexport-error" role="alert">{exportError}</p>}
        {exportNotice && <p className="dataexport-feedback dataexport-success" role="status">{exportNotice}</p>}

      </div>

      {/* Recent exports */}
      <div className="recent-export">

        <div className="recent-heading">
          <h3>Recent Export</h3>
        </div>

        <div className="recent-export-content">
          {recentExports.length ? recentExports.map((item) => (
            <div className="attendance-report" key={item.id}>
              <div>
                <h3>{item.fileName}</h3>
                <p>{new Date(item.createdAt).toLocaleString()} · {RANGE_LABELS[item.range] || "Selected range"}</p>
              </div>
              <div className="download-container">
                <FiDownload className="fidownload" />
                <button type="button" onClick={() => performExport(item, false)} disabled={isExporting}>Download again</button>
              </div>
            </div>
          )) : (
            <p className="dataexport-empty-history">Your attendance exports will appear here after your first download.</p>
          )}
        </div>
      </div>

      {/* Data retention */}
      <div className="data-retention">

        <div className="retention-heading">
          <h3>Data retention</h3>
        </div>

        <div className="retention-content">
          <p>
            Your attendance data is retained for 7 years in compliance with
            labor regulations. You may request a full data export or deletion
            via your organization admin.
          </p>
        </div>

      </div>

    </div>
  );
};
