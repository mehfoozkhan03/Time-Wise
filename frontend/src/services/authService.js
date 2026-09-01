import api from "./api";

export const authService = {
  signup(data) {
    return api.post("/user/signup", data);
  },

  login(data) {
    return api.post("/user/login", data);
  },

  /*   adminLogin(data) {
    return api.post('/user/adminlogin', data);
  },
 */
  logout() {
    return api.post("/user/logout");
  },

  getCurrentUser() {
    return api.get("/user/me");
  },

  getUserProfile: (userId) => api.get(`/user/profile/${userId}`),

  updateTheme(theme) {
    return api.patch("/user/theme", { theme });
  },

  getAllUser(page, limit, search = "", department = "All", status = "All") {
    return api.get(
      `/user/users?page=${page}&limit=${limit}&search=${encodeURIComponent(
        search,
      )}&department=${encodeURIComponent(
        department,
      )}&status=${encodeURIComponent(status)}`,
    );
  },

  updateActivity() {
    return api.patch("/user/activity");
  },

  updateUserDepartment(userId, department) {
    return api.patch(`/user/${userId}/department`, {
      department,
    });
  },

  updateUserDesignation(userId, designation) {
    return api.patch(`/user/${userId}/designation`, {
      designation,
    });
  },

  updateRole(userId, role) {
    return api.patch(`/user/${userId}/role`, {
      role,
    });
  },

  updateUser(userId, userData) {
    return api.put(`/user/users/${userId}`, userData);
  },
};
