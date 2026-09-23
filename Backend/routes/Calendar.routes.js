import express from "express";

import { auth } from "../middleware/AuthMiddleware.js";
import { adminAuth } from "../middleware/adminAuth.js";

import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/User/calendar.controller.js";

const router = express.Router();

const calendarAuth = (req, res, next) => {
  if (req.cookies?.adminToken) {
    return adminAuth(req, res, next);
  }

  return auth(req, res, next);
};

router.use(calendarAuth);

router.get("/", getAllEvents);

router.get("/:id", getEventById);

router.post("/", createEvent);

router.put("/:id", updateEvent);

router.delete("/:id", deleteEvent);

export default router;