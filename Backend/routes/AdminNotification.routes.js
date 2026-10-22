import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";

import {
  getRecipientOptions,
  createAdminNotification,
  getAdminSentNotifications,
} from "../controllers/Admin/adminNotification.controller.js";

const adminNotificationRoutes = express.Router();

adminNotificationRoutes.get("/recipients", adminAuth, getRecipientOptions);

adminNotificationRoutes.get("/sent", adminAuth, getAdminSentNotifications);

adminNotificationRoutes.post("/", adminAuth, createAdminNotification);

export { adminNotificationRoutes };
