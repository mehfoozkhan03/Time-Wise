import axios from "axios";

/* =========================================
   Axios Instance
========================================= */

export const API = axios.create({
  baseURL: import.meta.env.VITE_HOLIDAY_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================================
   Holiday Service
========================================= */

export const holidayService = {
    getHolidays: async () => {
      const response = await API.get("/holidays");

      console.log(response.data);

      return response;
  },
};