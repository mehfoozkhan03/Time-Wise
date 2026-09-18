import express  from 'express';
import { admin_login, adminLogout, getAllTodayAttendance, getAllUser } from '../controllers/Admin/adminData.controller.js';
import { getRecentEmployees } from '../controllers/Admin/recentEmployee.controller.js';
import { updateUserDepartment } from '../controllers/Admin/updateDepartment.controller.js';
import { updateUserDesignation } from '../controllers/Admin/updateDesignation.controller.js';
import { adminAuth  } from '../middleware/adminAuth.js';
import { updateRole } from '../controllers/Admin/updateRole.controller.js';
import { updateUser } from '../controllers/Admin/updateEmployee.controller.js';
import { adminDeleteThought } from '../controllers/Admin/adminThought.controller.js';
import { getAISettings, getAISettingsEmployees, updateAISettings } from "../controllers/Admin/aiSettings.controller.js";
import { askAdminAI } from "../controllers/Admin/adminAI.controller.js";


const adminRoutes = express.Router()

adminRoutes.post("/adminlogin", admin_login);

adminRoutes.post("/logout", adminAuth, adminLogout);

adminRoutes.get("/users", adminAuth , getAllUser);

adminRoutes.get("/recent-employees", adminAuth , getRecentEmployees);

adminRoutes.patch("/:userId/department",adminAuth, updateUserDepartment);

adminRoutes.patch("/:userId/designation",adminAuth,updateUserDesignation);

adminRoutes.patch("/:userId/role", adminAuth ,updateRole);

adminRoutes.put("/users/:userId", adminAuth ,updateUser);

adminRoutes.get("/attendance/today", adminAuth, getAllTodayAttendance);

adminRoutes.delete("/delete/thoughts/:id",  adminAuth,  adminDeleteThought);


adminRoutes.get("/ai-settings", adminAuth, getAISettings);
adminRoutes.put("/ai-settings", adminAuth, updateAISettings);
adminRoutes.get("/ai-settings/employees", adminAuth, getAISettingsEmployees);
adminRoutes.post("/admin-ai/chat", adminAuth, askAdminAI);

export { adminRoutes };
