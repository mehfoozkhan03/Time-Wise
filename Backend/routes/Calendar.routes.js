import express from "express";

import { auth } from "../middlewares/auth.js";

import {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
} from "../controllers/calendarController.js";

const router = express.Router();

/* Authenticate all Calendar routes */
router.use(auth);

/* =========================================
   Calendar Routes
========================================= */

router.get("/", getAllEvents);

router.get("/:id", getEventById);

router.post("/", createEvent);

router.put("/:id", updateEvent);

router.delete("/:id", deleteEvent);

export default router;