import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const notificationService = {
  getNotifications() {
    return axios.get(`${API}/notifications`, {
      withCredentials: true,
    });
  },
};