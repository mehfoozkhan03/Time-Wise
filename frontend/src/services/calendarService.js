import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const calendarService = {
  /* ==========================
       Get All Events
    ========================== */

  getEvents: () => API.get("/calendar"),

  /* ==========================
       Get Single Event
    ========================== */

  getEventById: (id) => API.get(`/calendar/${id}`),

  /* ==========================
       Create Event
    ========================== */

  createEvent: (data) => API.post("/calendar", data),

  /* ==========================
       Update Event
    ========================== */

  updateEvent: (id, data) => API.put(`/calendar/${id}`, data),

  /* ==========================
       Delete Event
    ========================== */

  deleteEvent: (id) => API.delete(`/calendar/${id}`),
};
