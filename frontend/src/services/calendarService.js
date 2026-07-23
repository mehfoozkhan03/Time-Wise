import axios from "axios";

/* =========================================
   Axios Instance
========================================= */

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

/* =========================================
   API Endpoints
========================================= */

const BASE_URL = "/calendar";

/* =========================================
   Calendar Service
========================================= */

export const calendarService = {
  /* =========================================
       Get All Events
    ========================================= */

  getEvents: (params = {}) =>
    API.get(BASE_URL, {
      params,
    }),

  /* =========================================
       Get Single Event
    ========================================= */

  getEventById: (id) => API.get(`${BASE_URL}/${id}`),

  /* =========================================
       Create Event
    ========================================= */

  createEvent: (data) => API.post(BASE_URL, data),

  /* =========================================
       Update Event
    ========================================= */

  updateEvent: (id, data) => API.put(`${BASE_URL}/${id}`, data),

  /* =========================================
       Delete Event
    ========================================= */

  deleteEvent: (id) => API.delete(`${BASE_URL}/${id}`),
};
