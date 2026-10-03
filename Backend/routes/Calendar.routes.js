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

/* =========================================
   Calendar Authentication
========================================= */

const calendarAuth = (req, res, next) => {
  const authType = req.headers["x-auth-type"];

  /*
   * Explicit Admin Calendar request
   */
  if (authType === "admin") {
    if (!req.cookies?.adminToken) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required.",
      });
    }

    return adminAuth(req, res, next);
  }

  /*
   * Explicit Employee/User Calendar request
   */
  if (authType === "user") {
    if (!req.cookies?.token) {
      return res.status(401).json({
        success: false,
        message: "User authentication required.",
      });
    }

    return auth(req, res, next);
  }

  /*
   * Backward-compatible fallback
   *
   * This is used only when the frontend does not
   * provide an explicit calendar authentication type.
   */
  if (req.cookies?.adminToken) {
    return adminAuth(req, res, next);
  }

  if (req.cookies?.token) {
    return auth(req, res, next);
  }

  return res.status(401).json({
    success: false,
    message: "Authentication required.",
  });
};

router.use(calendarAuth);

/* =========================================
   Calendar Routes
========================================= */

router.get("/", getAllEvents);

router.get("/:id", getEventById);

router.post("/", createEvent);

router.put("/:id", updateEvent);

router.delete("/:id", deleteEvent);

export default router;          