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
import { updateUser } from "../controllers/updateEmployee.controller.js";
import { updateRole } from "../controllers/updateRole.controller.js";
import { getRecentEmployees } from "../controllers/recentEmployee.controller.js";
import { authorize } from "../middleware/Allowrole.middleware.js";

const userRoutes = express.Router();

// /user/signup

// /user/login

// /user/adminlogin

// /user/me

userRoutes.post("/login", login);

userRoutes.post("/signup", signup);

userRoutes.post("/logout", logout);
// userRoutes.post("/logout", auth, authorize("user", "admin"), logout);


userRoutes.get("/me", auth,authorize("user"), getCurrentUser);

userRoutes.get("/users", auth,  authorize("admin"), getAllUser);

userRoutes.patch("/activity", auth, authorize("user"), updateActivity);

userRoutes.get("/recent-employees", auth, authorize("admin"), getRecentEmployees);

userRoutes.patch("/:userId/department",  authorize("admin"), updateUserDepartment);

userRoutes.patch("/:userId/designation",  authorize("admin"),updateUserDesignation);

userRoutes.patch("/:userId/role", auth,  authorize("admin"),updateRole);


userRoutes.patch("/theme", auth, authorize("user", "admin"), updateTheme);

userRoutes.put("/users/:userId", auth,  authorize("admin"),updateUser);
// userRoutes.patch("/:userId", auth, adminOnly, updateEmployee);

userRoutes.get("/profile/:userId", auth, authorize("admin"), getUserProfile);

userRoutes.post("/adminlogin", admin_login);

export { userRoutes };
