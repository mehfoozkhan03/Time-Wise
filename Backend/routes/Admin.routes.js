import express  from 'express';
import { admin_login, getAllUser } from '../controllers/Admin/adminData.controller.js';
import { getUserProfile, updateActivity } from '../controllers/User/userData.controller.js';
import { getRecentEmployees } from '../controllers/Admin/recentEmployee.controller.js';
import { updateUserDepartment } from '../controllers/Admin/updateDepartment.controller.js';
import { updateUserDesignation } from '../controllers/Admin/updateDesignation.controller.js';
import { adminAuth  } from '../middleware/adminAuth.js';
import { updateRole } from '../controllers/Admin/updateRole.controller.js';
import { updateUser } from '../controllers/Admin/updateEmployee.controller.js';


const adminRoutes = express.Router()


adminRoutes.get("/users", adminAuth , getAllUser);

adminRoutes.get("/recent-employees", adminAuth , getRecentEmployees);

adminRoutes.patch("/:userId/department",adminAuth, updateUserDepartment);

adminRoutes.patch("/:userId/designation",adminAuth,updateUserDesignation);

adminRoutes.patch("/:userId/role", adminAuth ,updateRole);

adminRoutes.put("/users/:userId", adminAuth ,updateUser);

adminRoutes.get("/profile/:userId", adminAuth, getUserProfile);

adminRoutes.post("/adminlogin", admin_login);

export { adminRoutes };