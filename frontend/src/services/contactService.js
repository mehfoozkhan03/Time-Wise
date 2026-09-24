import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const contactService = {
  createContact: (data) => API.post("/api/contact", data),
};