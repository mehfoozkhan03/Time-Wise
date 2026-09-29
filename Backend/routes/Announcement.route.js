import express from "express";

import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  scheduleAnnouncement,
  togglePinAnnouncement,
} from "../controllers/Admin/announcement.controller.js";

import { adminAuth } from './../middleware/adminAuth.js';

const announcementRoutes = express.Router();

// ============================================================
// ANNOUNCEMENTS
// ============================================================

// Create announcement
announcementRoutes.post(
  "/announcements",
  adminAuth,
  createAnnouncement
);

// Get all announcements
announcementRoutes.get(
  "/announcements",
  adminAuth,
  getAllAnnouncements
);

// Get single announcement
announcementRoutes.get(
  "/announcements/:id",
  adminAuth,
  getAnnouncementById
);

// Update announcement
announcementRoutes.put(
  "/announcements/:id",
  adminAuth,
  updateAnnouncement
);

// Delete announcement
announcementRoutes.delete(
  "/announcements/:id",
  adminAuth,
  deleteAnnouncement
);

// Publish announcement
announcementRoutes.patch(
  "/announcements/:id/publish",
  adminAuth,
  publishAnnouncement
);

// Schedule announcement
announcementRoutes.patch(
  "/announcements/:id/schedule",
  adminAuth,
  scheduleAnnouncement
);

// Pin / Unpin announcement
announcementRoutes.patch(
  "/announcements/:id/pin",
  adminAuth,
  togglePinAnnouncement
);

export {announcementRoutes};