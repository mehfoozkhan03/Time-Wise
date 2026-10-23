
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const adminNotificationService = {
  getRecipients(search = "") {
    return API.get("/admin/notifications/recipients", {
      params: { search },
    });
  },

  createNotification(payload) {
    return API.post("/admin/notifications", payload);
  },

  getSentNotifications(page = 1, limit = 10) {
    return API.get("/admin/notifications/sent", {
      params: { page, limit },
    });
  },
};
