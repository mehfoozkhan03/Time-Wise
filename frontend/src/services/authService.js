import api from "./api";

export const authService = {
  signup(data) {
    return api.post("/user/signup", data);
  },

  login(data) {
    return api.post("/user/login", data);
  },

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

  updateActivity() {
    return api.patch("/user/activity");
  },

  updateSocialLinks(socialLinks) {
    return api.patch("/user/social-links", socialLinks);
  },
  
  updateEmergencyContact(emergencyContact) {
    return api.patch("/user/emergency-contact", emergencyContact);
  },
};
