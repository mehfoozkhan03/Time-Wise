import axios from "axios";

/* =========================================
   Axios Instance
========================================= */

const API = axios.create({
  baseURL: "https://testapi-zc4z.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================================
   Holiday Service
========================================= */

export const holidayService = {
  async getHolidays() {
    try {
      const response = await API.get("/holidays");

      console.log("✅ Holiday Service Response:", response.data);

      return response;
    } catch (error) {
      console.error("❌ Holiday Service Error:", error);

      throw error;
    }
  },
};