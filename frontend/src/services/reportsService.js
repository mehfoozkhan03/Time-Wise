import api from "./api";

export const getDashboardStats = async () => {
  const response = await api.get("/attendance/dashboard-stats");
  return response.data.stats;
};

export const getAttendanceHistory = async () => {
  const response = await api.get("/attendance/history");
  return response.data.attendance;
};
