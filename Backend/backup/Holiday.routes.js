import express from "express";

import { auth } from "../middleware/AuthMiddleware.js";
import { adminAuth } from "../middleware/adminAuth.js";

import {
  getAllHolidays,
  getHolidayById,
  createHoliday,
  updateHoliday,
  deleteHoliday,
} from "../controllers/User/holiday.controller.js";

const holidayRouter = express.Router();

const holidayAuth = (req, res, next) => {
  if (req.cookies?.adminToken) {
    return adminAuth(req, res, next);
  }

  return auth(req, res, next);
};

holidayRouter.get("/", holidayAuth, getAllHolidays);

holidayRouter.get("/:id", holidayAuth, getHolidayById);

holidayRouter.post("/", adminAuth, createHoliday);

holidayRouter.put("/:id", adminAuth, updateHoliday);

holidayRouter.delete("/:id", adminAuth, deleteHoliday);

export default holidayRouter;