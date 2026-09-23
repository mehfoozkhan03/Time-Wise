import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const adminAuthService = {
  login: (data) => API.post("/admin/adminlogin", data),

  logout() {
    return API.post("/admin/logout");
  },

  getAllUser(page, limit, search = "", department = "All", status = "All") {
    return API.get(
      `/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(
        search,
      )}&department=${encodeURIComponent(
        department,
      )}&status=${encodeURIComponent(status)}`,
    );
  },

  getRecentEmployees() {
    return API.get("/admin/recent-employees");
  },

  updateUser(userId, userData) {
    return API.put(`/admin/users/${userId}`, userData);
  },

  updateUserDepartment(userId, department) {
    return API.patch(`/admin/${userId}/department`, {
      department,
    });
  },

  updateUserDesignation(userId, designation) {
    return API.patch(`/admin/${userId}/designation`, {
      designation,
    });
  },

  updateRole(userId, role) {
    return API.patch(`/admin/${userId}/role`, {
      role,
    });
  },

  getAllTodayAttendance() {
    return API.get("/admin/attendance/today");
  },

  togglePinThought(postId) {
    return API.patch(`/admin/thoughts/${postId}/pin`);
  },

  deleteThoughtbyAdmin(postId) {
    return API.delete(`/admin/delete/thoughts/${postId}`);
  },
};
