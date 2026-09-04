import express from "express";

import { auth } from "../middleware/AuthMiddleware.js";

import {
  getAllHolidays,
  getHolidayById,
  createHoliday,
  updateHoliday,
  deleteHoliday,
} from "../controllers/holiday.controller.js";
import { authorize } from "../middleware/Allowrole.middleware.js";

const holidayRouter = express.Router();

// Employee + Admin
holidayRouter.get("/", auth,authorize("user", "admin"), getAllHolidays);
holidayRouter.get("/:id", auth,authorize("user", "admin"), getHolidayById);

// Admin Only (Permission checked inside controller)
holidayRouter.post("/", auth, authorize("admin"),createHoliday);
holidayRouter.put("/:id", auth, authorize("admin"),updateHoliday);
holidayRouter.delete("/:id", auth,authorize("admin"), deleteHoliday);

export default holidayRouter;