import api from "./api";

const adminReportService = {
  getWeeklyAttendance() {
    return api.get("/admin/reports/weekly-attendance");
  },

  getDepartmentHeadcount() {
    return api.get("/admin/reports/department-headcount");
  },

  getAttendanceTrend() {
    return api.get("/admin/reports/attendance-trend");
  },
};

export default adminReportService;
