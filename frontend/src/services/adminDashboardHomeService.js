import api from "./api";

export const adminDashboardHomeService = {
  getDashboardStats() {
    return api.get("/admin/dashboard-stats");
  },
};