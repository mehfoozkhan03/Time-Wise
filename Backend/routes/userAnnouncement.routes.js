
import express from "express";

import { auth } from './../middleware/AuthMiddleware.js';
import { getEmployeeAnnouncements } from "../controllers/Admin/announcement.controller.js";

const userAnnouncementRoutes = express.Router();

// Get published announcements for the logged-in employee
userAnnouncementRoutes.get("/announcements", auth, getEmployeeAnnouncements);

export { userAnnouncementRoutes };
