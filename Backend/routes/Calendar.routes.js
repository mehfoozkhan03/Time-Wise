import express from "express";

import { auth } from "../middleware/AuthMiddleware.js";

import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/User/calendar.controller.js";

const router = express.Router();

// ============================================================
// EMPLOYEE / USER CALENDAR AUTHENTICATION
// ============================================================

router.use(auth);

// ============================================================
// EMPLOYEE / USER CALENDAR ROUTES
// ============================================================

// Get all calendar events
router.get("/", getAllEvents);

// Get single calendar event
router.get("/:id", getEventById);

// Create calendar event
router.post("/", createEvent);

// Update calendar event
router.put("/:id", updateEvent);

// Delete calendar event
router.delete("/:id", deleteEvent);

export default router;