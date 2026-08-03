import express from "express";

import { auth } from "../middleware/AuthMiddleware.js";

import {
  getAllHolidays,
  getHolidayById,
  createHoliday,
  updateHoliday,
  deleteHoliday,
} from "../controllers/holiday.controller.js";

const holidayRouter = express.Router();

/* =========================================
   Holiday Routes
========================================= */

// Employee + Admin
holidayRouter.get("/", auth, getAllHolidays);
holidayRouter.get("/:id", auth, getHolidayById);

// Admin Only (Permission checked inside controller)
holidayRouter.post("/", auth, createHoliday);
holidayRouter.put("/:id", auth, updateHoliday);
holidayRouter.delete("/:id", auth, deleteHoliday);

export default holidayRouter;