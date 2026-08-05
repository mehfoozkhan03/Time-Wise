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

const BASE_URL = "/holiday";

/* =========================================
   Holiday Service
========================================= */

export const holidayService = {
  /* =========================================
     Get All Holidays
  ========================================= */

  getHolidays: (params = {}) =>
    API.get(BASE_URL, {
      params,
    }),

  /* =========================================
     Get Single Holiday
  ========================================= */

  getHolidayById: (id) => API.get(`${BASE_URL}/${id}`),

  /* =========================================
     Create Holiday
  ========================================= */

  createHoliday: (data) => API.post(BASE_URL, data),

  /* =========================================
     Update Holiday
  ========================================= */

  updateHoliday: (id, data) => API.put(`${BASE_URL}/${id}`, data),

  /* =========================================
     Delete Holiday
  ========================================= */

  deleteHoliday: (id) => API.delete(`${BASE_URL}/${id}`),
};