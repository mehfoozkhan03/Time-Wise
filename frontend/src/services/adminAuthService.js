import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const adminAuthService = {
  login: (data) => API.post("/admin/login", data),

  register: (data) => API.post("/admin/register", data),

  getCurrentAdmin: () => API.get("/admin/me"),
};