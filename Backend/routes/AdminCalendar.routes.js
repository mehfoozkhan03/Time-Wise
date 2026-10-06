import express from "express";

import { adminAuth } from "../middleware/adminAuth.js";

import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/Admin/calendar.controller.js";

const router = express.Router();

// ============================================================
// ADMIN CALENDAR AUTHENTICATION
// ============================================================

router.use(adminAuth);

// ============================================================
// ADMIN CALENDAR ROUTES
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