import express from "express";

import {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
} from "../controllers/calendarController.js";

const router = express.Router();

/* ==========================
   Calendar Routes
========================== */

// Get all events
router.get("/", getAllEvents);

// Get single event
router.get("/:id", getEventById);

// Create event
router.post("/", createEvent);

// Update event
router.put("/:id", updateEvent);

// Soft delete event
router.delete("/:id", deleteEvent);

export default router;