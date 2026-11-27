import express from "express";

import { auth } from "../middleware/AuthMiddleware.js";
import { authorize } from "../middleware/AllowRole.middleware.js";
import {
  getCurrentUser,
  getUserProfile,
  login,
  logout,
  signup,
  updateActivity,
  updateProfile,
  changeOwnPassword,
} from "../controllers/User/userData.controller.js";
import { getTheme, updateTheme } from "./../controllers/User/theme.controller.js";
import { updateSocialLinks } from "../controllers/User/socialLinks.controller.js";
import { updateEmergencyContact } from "../controllers/User/emergencyContact.controller.js";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../controllers/User/notificationPreferences.controller.js";
import { uploadProfileImage } from "../middleware/profileUpload.middleware.js";

const userRoutes = express.Router();

// /user/signup

// /user/login

// /user/me

userRoutes.post("/login", login);

userRoutes.post("/signup", signup);

userRoutes.post("/logout", logout);

userRoutes.get("/me", auth, authorize("user", "admin"), getCurrentUser);

userRoutes.patch("/profile", auth, authorize("user"), uploadProfileImage, updateProfile);
userRoutes.patch("/change-password", auth, authorize("user"), changeOwnPassword);

userRoutes.get("/profile/:userId", auth, getUserProfile);

userRoutes.patch("/activity", auth, authorize("user"), updateActivity);

userRoutes.get("/theme", auth, getTheme);

userRoutes.patch("/theme", auth, authorize("user", "admin"), updateTheme);

userRoutes.patch("/social-links", auth, authorize("user"), updateSocialLinks);

userRoutes.patch("/emergency-contact", auth, authorize("user"), updateEmergencyContact);

userRoutes.get("/notification-preferences", auth, authorize("user"), getNotificationPreferences);

userRoutes.patch("/notification-preferences", auth, authorize("user"), updateNotificationPreferences);

export { userRoutes };
