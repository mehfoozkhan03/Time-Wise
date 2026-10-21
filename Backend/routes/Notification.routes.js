import express from "express";
import { auth } from "../middleware/AuthMiddleware.js";
import { deleteNotification, getNotifications, getUnreadNotificationCount, markNotificationAsRead } from "../controllers/User/notification.controller.js";
import { authorize } from "../middleware/Allowrole.middleware.js";
const notificationRoute = express.Router();

notificationRoute.get("/", auth,authorize("user", "admin"), getNotifications);

notificationRoute.patch("/:id/read", auth, authorize("user", "admin"), markNotificationAsRead);

notificationRoute.delete("/:id", auth, authorize("user", "admin"), deleteNotification);

notificationRoute.get("/unread-count", auth, authorize("user", "admin"), getUnreadNotificationCount);

export default notificationRoute;