import express from "express";

import { auth } from "../middleware/AuthMiddleware.js";
import { authorize } from "../middleware/Allowrole.middleware.js";
import {
  getCurrentUser,
  getUserProfile,
  login,
  logout,
  signup,
  updateActivity,
} from "../controllers/User/userData.controller.js";
import {
  admin_login,
  getAllUser,
} from "./../controllers/Admin/adminData.controller.js";
import { updateUserDepartment } from "./../controllers/Admin/updateDepartment.controller.js";
import { getRecentEmployees } from "./../controllers/Admin/recentEmployee.controller.js";
import { updateUserDesignation } from "./../controllers/Admin/updateDesignation.controller.js";
import { updateRole } from "./../controllers/Admin/updateRole.controller.js";
import { updateTheme } from "./../controllers/User/theme.controller.js";
import { updateUser } from "./../controllers/Admin/updateEmployee.controller.js";

const userRoutes = express.Router();

// /user/signup

// /user/login

// /user/adminlogin

// /user/me

userRoutes.post("/login", login);

userRoutes.post("/signup", signup);

userRoutes.post("/logout", logout);
// userRoutes.post("/logout", auth, authorize("user", "admin"), logout);

userRoutes.get("/me", auth, authorize("user"), getCurrentUser);

// userRoutes.get("/users", auth,  authorize("admin"), getAllUser);

userRoutes.patch("/activity", auth, authorize("user"), updateActivity);

// userRoutes.get("/recent-employees", auth, authorize("admin"), getRecentEmployees);

// userRoutes.patch("/:userId/department",  authorize("admin"), updateUserDepartment);

// userRoutes.patch("/:userId/designation",  authorize("admin"),updateUserDesignation);

// userRoutes.patch("/:userId/role", auth,  authorize("admin"),updateRole);

userRoutes.patch("/theme", auth, authorize("user"), updateTheme);

// userRoutes.put("/users/:userId", auth,  authorize("admin"),updateUser);
// // userRoutes.patch("/:userId", auth, adminOnly, updateEmployee);

// userRoutes.get("/profile/:userId", auth, authorize("admin"), getUserProfile);

// userRoutes.post("/adminlogin", admin_login);

export { userRoutes };
