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
const ADMIN_BASE_URL = "/admin/calendar";

/* =========================================
   Calendar Base URL Helper
========================================= */

const getCalendarBaseUrl = (authType) => {
  return authType === "admin" ? ADMIN_BASE_URL : BASE_URL;
};

/* =========================================
   Calendar Service
========================================= */

export const calendarService = {
  /* =========================================
       Get All Events
    ========================================= */

  getEvents: (params = {}, authType) => {
    const baseUrl = getCalendarBaseUrl(authType);

    return API.get(baseUrl, {
      params,
    });
  },

  /* =========================================
       Get Single Event
    ========================================= */

  getEventById: (id, authType) => {
    const baseUrl = getCalendarBaseUrl(authType);

    return API.get(`${baseUrl}/${id}`);
  },

  /* =========================================
       Create Event
    ========================================= */

  createEvent: (data, authType) => {
    const baseUrl = getCalendarBaseUrl(authType);

    return API.post(baseUrl, data);
  },

  /* =========================================
       Update Event
    ========================================= */

  updateEvent: (id, data, authType) => {
    const baseUrl = getCalendarBaseUrl(authType);

    return API.put(`${baseUrl}/${id}`, data);
  },

  /* =========================================
       Delete Event
    ========================================= */

  deleteEvent: (id, authType) => {
    const baseUrl = getCalendarBaseUrl(authType);

    return API.delete(`${baseUrl}/${id}`);
  },
};