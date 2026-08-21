// import { getAllUser } from "../../../Backend/controllers/userData.controller";
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
  getAllUser(page, limit) {
    return api.get(`/user/users?page=${page}&limit=${limit}`);
  },
  updateActivity() {
    return api.patch("/user/activity");
  },
};
