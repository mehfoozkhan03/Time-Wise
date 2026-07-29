import express from "express";
import { auth } from "../middleware/AuthMiddleware.js";
import { getNotifications } from "../controllers/Notification.controller.js";

const notificationRoutes = express.Router();

notificationRoutes.get("/", auth, getNotifications);

export default notificationRoutes;