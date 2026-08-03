// import express from "express";
// import { auth } from "../middleware/AuthMiddleware.js";
// import { getNotifications } from "../controllers/Notification.controller.js";

// const notificationRoutes = express.Router();

// notificationRoutes.get("/", auth, getNotifications);

// export default notificationRoutes;


import express from "express";
import { auth } from "../middleware/AuthMiddleware.js";
import { deleteNotification, getNotifications, getUnreadNotificationCount, markNotificationAsRead } from "../controllers/notification.controller.js";

const notificationRoute = express.Router();

notificationRoute.get("/", auth, getNotifications);

notificationRoute.patch("/:id/read", auth, markNotificationAsRead);

notificationRoute.delete("/:id", auth, deleteNotification);

notificationRoute.get("/unread-count", auth, getUnreadNotificationCount);

export default notificationRoute;