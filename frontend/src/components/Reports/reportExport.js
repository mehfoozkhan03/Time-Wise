import { roundHours } from "./formatHours";

const escapeXml = (value) =>
  String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const safeSheetName = (name) => name.replace(/[\\/?*\[\]:]/g, " ").slice(0, 31);

const formatDate = (value) => {
  if (!value) return "—";
  const dateKey = typeof value === "string" ? value.slice(0, 10) : "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    const [year, month, day] = dateKey.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString();
  }
  return new Date(value).toLocaleDateString();
};

const formatTime = (value) =>
  value
    ? new Date(value).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const formatHours = (seconds) => roundHours((Number(seconds) || 0) / 3600).toFixed(2);

export function buildReportExportData({
  rangeLabel,
  customStartDate,
  customEndDate,
  stats = {},
  attendance = [],
  calendar = [],
  filteredAttendance = attendance,
}) {
  const daily = attendance.map((record) => ({
    date: formatDate(record.dateKey || record.date),
    hours: roundHours((Number(record.totalWorkingSeconds) || 0) / 3600),
    target: 8,
    status: record.status || "—",
  }));

  const weeks = new Map();
  attendance.forEach((record) => {
    const key = String(record.dateKey || record.date || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return;
    const [year, month, day] = key.split("-").map(Number);
    const weekStart = new Date(year, month - 1, day);
    const weekday = weekStart.getDay();
    weekStart.setDate(weekStart.getDate() + (weekday === 0 ? -6 : 1 - weekday));
    const weekKey = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;
    const week = weeks.get(weekKey) || { week: formatDate(weekKey), actual: 0, target: 40 };
    week.actual += (Number(record.totalWorkingSeconds) || 0) / 3600;
    weeks.set(weekKey, week);
  });

  const weekly = [...weeks.values()].map((week) => ({
    ...week,
    actual: roundHours(week.actual),
  }));
  const distribution = new Map();
  const chartStatuses = new Set(["Present", "Late", "Absent", "Leave", "Holiday", "Half day"]);
  calendar.forEach(({ status }) => {
    if (!status) return;
    const normalized = status[0].toUpperCase() + status.slice(1).toLowerCase();
    if (!chartStatuses.has(normalized)) return;
    distribution.set(normalized, (distribution.get(normalized) || 0) + 1);
  });

  const attendanceRows = filteredAttendance.map((record) => ({
    date: formatDate(record.dateKey || record.date),
    checkIn: formatTime(record.checkInTime),
    checkOut: formatTime(record.checkOutTime),
    hours: formatHours(record.totalWorkingSeconds),
    break: `${Math.floor((Number(record.totalBreakSeconds) || 0) / 60)} min`,
    overtime: roundHours(Math.max(0, (Number(record.totalWorkingSeconds) || 0) / 3600 - 8)).toFixed(2),
    status: record.status || "—",
    notes: record.notes || "",
  }));

  const period = rangeLabel === "Custom Range" && customStartDate && customEndDate
    ? `${formatDate(customStartDate)} – ${formatDate(customEndDate)}`
    : rangeLabel;

  return {
    title: "TimeWise Personal Report",
    period,
    generated: new Date().toLocaleString(),
    summary: [
      ["Attendance Rate", `${Number(stats.attendancePercentage) || 0}%`],
      ["Total Working Hours", `${roundHours(Number(stats.monthlyHours) || 0).toFixed(2)} h`],
      ["Average Daily Hours", `${roundHours(Number(stats.averageDailyHours) || 0).toFixed(2)} h`],
      ["Overtime Hours", `${roundHours(Number(stats.overtimeHours) || 0).toFixed(2)} h`],
      ["Productivity Score", `${Number(stats.productivity) || 0}%`],
      ["Punctuality", `${Number(stats.punctuality) || 0}%`],
      ["Leaves Taken", Number(stats.leavesTaken) || 0],
      ["Current Streak", `${Number(stats.dayStreak) || 0} days`],
      ["Best Streak", `${Number(stats.longestStreak) || 0} days`],
      ["Average Check-in", stats.averageCheckIn || "—"],
      ["Average Break", `${Number(stats.averageBreakDuration) || 0} min`],
    ],
    productivity: [
      ["Productivity Score", `${Number(stats.productivity) || 0}%`],
      ["Punctuality", `${Number(stats.punctuality) || 0}%`],
      ["Weekly Goal Progress", `${Number(stats.weeklyGoalPercentage) || 0}%`],
      ["Break Score", `${Number(stats.breakScore) || 0}%`],
    ],
    daily,
    weekly,
    distribution: [...distribution].map(([status, days]) => ({ status, days })),
    calendar: calendar.map((item) => ({
      date: formatDate(item.dateKey || item.date),
      status: item.status || "—",
    })),
    attendance: attendanceRows,
  };
}

const makeTable = (headers, rows) => `
  <table><thead><tr>${headers.map((item) => `<th>${escapeXml(item)}</th>`).join("")}</tr></thead>
  <tbody>${rows.length ? rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeXml(cell)}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${headers.length}">No data for this period</td></tr>`}</tbody></table>`;

export function exportReportPDF(report) {
  const printWindow = window.open("", "_blank", "width=1000,height=800");
  if (!printWindow) throw new Error("Allow pop-ups to print or save this report as PDF.");

  const sections = [
    ["Summary", makeTable(["Measure", "Value"], report.summary)],
    ["Daily Hours", makeTable(["Date", "Hours Worked", "Daily Target", "Status"], report.daily.map((item) => [item.date, `${item.hours.toFixed(2)} h`, `${item.target} h`, item.status]))],
    ["Weekly vs Target", makeTable(["Week Starting", "Actual Hours", "Target Hours", "Difference"], report.weekly.map((item) => [item.week, `${item.actual.toFixed(2)} h`, `${item.target} h`, `${roundHours(item.actual - item.target).toFixed(2)} h`]))],
    ["Attendance Distribution", makeTable(["Status", "Days"], report.distribution.map((item) => [item.status, item.days]))],
    ["Productivity", makeTable(["Measure", "Value"], report.productivity)],
    ["Attendance Calendar", makeTable(["Date", "Status"], report.calendar.map((item) => [item.date, item.status]))],
    ["Attendance Log", makeTable(["Date", "Check-in", "Check-out", "Hours", "Break", "Overtime", "Status", "Notes"], report.attendance.map((item) => [item.date, item.checkIn, item.checkOut, `${item.hours} h`, item.break, `${item.overtime} h`, item.status, item.notes]))],
  ];
  printWindow.document.write(`<!doctype html><html><head><title>${escapeXml(report.title)}</title><style>
    body{font:14px Arial,sans-serif;color:#172033;margin:32px}h1{margin-bottom:4px;color:#27358b}p{margin:4px 0 22px;color:#536078}section{break-inside:avoid;margin:24px 0}h2{font-size:17px;margin-bottom:9px}table{border-collapse:collapse;width:100%;font-size:11px}th,td{border:1px solid #d7ddea;padding:7px;text-align:left}th{background:#eef1fb}tr:nth-child(even){background:#f8f9fc}@media print{body{margin:14mm}}
  </style></head><body><h1>${escapeXml(report.title)}</h1><p>Period: ${escapeXml(report.period)} · Generated: ${escapeXml(report.generated)}</p>${sections.map(([title, html]) => `<section><h2>${escapeXml(title)}</h2>${html}</section>`).join("")}<script>window.onload=()=>window.print()</script></body></html>`);
  printWindow.document.close();
}

export function exportReportExcel(report) {
  const sheets = [
    { name: "Summary", headers: ["Measure", "Value"], rows: [["Report", report.title], ["Period", report.period], ["Generated", report.generated], ...report.summary] },
    { name: "Daily Hours", headers: ["Date", "Hours Worked", "Daily Target", "Status"], rows: report.daily.map((item) => [item.date, item.hours, item.target, item.status]) },
    { name: "Weekly vs Target", headers: ["Week Starting", "Actual Hours", "Target Hours", "Difference"], rows: report.weekly.map((item) => [item.week, item.actual, item.target, roundHours(item.actual - item.target)]) },
    { name: "Attendance Distribution", headers: ["Status", "Days"], rows: report.distribution.map((item) => [item.status, item.days]) },
    { name: "Productivity", headers: ["Measure", "Value"], rows: report.productivity },
    { name: "Attendance Calendar", headers: ["Date", "Status"], rows: report.calendar.map((item) => [item.date, item.status]) },
    { name: "Attendance Log", headers: ["Date", "Check-in", "Check-out", "Hours", "Break", "Overtime", "Status", "Notes"], rows: report.attendance.map((item) => [item.date, item.checkIn, item.checkOut, Number(item.hours), item.break, Number(item.overtime), item.status, item.notes]) },
  ];
  const worksheets = sheets.map(({ name, headers, rows }) => {
    const allRows = [headers, ...rows];
    const xmlRows = allRows.map((row) => `<Row>${row.map((value) => {
      const numeric = typeof value === "number" && Number.isFinite(value);
      return `<Cell><Data ss:Type="${numeric ? "Number" : "String"}">${escapeXml(value)}</Data></Cell>`;
    }).join("")}</Row>`).join("");
    return `<Worksheet ss:Name="${escapeXml(safeSheetName(name))}"><Table>${xmlRows}</Table></Worksheet>`;
  }).join("");
  const workbook = `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">${worksheets}</Workbook>`;
  const blob = new Blob([workbook], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `TimeWise-Report-${report.period.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}.xls`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
