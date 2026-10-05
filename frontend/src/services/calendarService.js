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
   Authentication Helper
========================================= */

const getAuthHeaders = (authType) => {
  if (!authType) {
    return {};
  }

  return {
    "x-auth-type": authType,
  };
};

/* =========================================
   Calendar Service
========================================= */

export const calendarService = {
  /* =========================================
       Get All Events
    ========================================= */

  getEvents: (params = {}, authType) =>
    API.get(BASE_URL, {
      params,
      headers: getAuthHeaders(authType),
    }),

  /* =========================================
       Get Single Event
    ========================================= */

  getEventById: (id, authType) =>
    API.get(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders(authType),
    }),

  /* =========================================
       Create Event
    ========================================= */

  createEvent: (data, authType) =>
    API.post(BASE_URL, data, {
      headers: getAuthHeaders(authType),
    }),

  /* =========================================
       Update Event
    ========================================= */

  updateEvent: (id, data, authType) =>
    API.put(`${BASE_URL}/${id}`, data, {
      headers: getAuthHeaders(authType),
    }),

  /* =========================================
       Delete Event
    ========================================= */

  deleteEvent: (id, authType) =>
    API.delete(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders(authType),
    }),
};