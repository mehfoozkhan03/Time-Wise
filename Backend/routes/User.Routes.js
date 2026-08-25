import express from "express";

import {
  admin_login,
  login,
  signup,
  getCurrentUser,
  updateTheme,
  logout,
  getUserProfile,
  getAllUser,
  updateActivity,
} from "../controllers/userData.controller.js";

import { auth } from "../middleware/AuthMiddleware.js";
import { updateUserDepartment } from "../controllers/updateDepartment.controller.js";
import { updateUserDesignation } from "./../controllers/updateDesignation.controller.js";
import { updateEmployee } from "../controllers/updateEmployee.controller.js";

const userRoutes = express.Router();

// /user/signup

// /user/login

// /user/adminlogin

// /user/me

userRoutes.post("/login", login);

userRoutes.post("/signup", signup);

userRoutes.post("/logout", logout);

userRoutes.get("/me", auth, getCurrentUser);

userRoutes.get("/users", auth, getAllUser);

userRoutes.patch("/activity", auth, updateActivity);

userRoutes.patch("/:userId/department", updateUserDepartment);

userRoutes.patch("/:userId/designation", updateUserDesignation);

userRoutes.patch("/theme", auth, updateTheme);

userRoutes.patch("/:userId", auth, updateEmployee);
// userRoutes.patch("/:userId", auth, adminOnly, updateEmployee);

userRoutes.get("/profile/:userId", auth, getUserProfile);

userRoutes.post("/adminlogin", admin_login);

export { userRoutes };
