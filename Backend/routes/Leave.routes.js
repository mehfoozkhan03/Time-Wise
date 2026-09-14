import express from "express";

import { auth } from "../middleware/AuthMiddleware.js";
import { authorize } from "../middleware/Allowrole.middleware.js";
import { adminAuth } from "../middleware/adminAuth.js";

import {
  createLeave,
  getMyLeaves,
  getMyLeaveById,
  getMyLeaveBalance,
  cancelMyLeave,
  getAllLeavesForAdmin,
  getAdminLeaveDetails,
  approveLeave,
  rejectLeave,
  getAdminLeaveStats,
} from "../controllers/User/leave.controller.js";

const router = express.Router();

router.post("/", auth, authorize("user"), createLeave);

router.get("/my", auth, authorize("user"), getMyLeaves);

router.get("/balance", auth, authorize("user"), getMyLeaveBalance);

router.get("/admin", adminAuth, getAllLeavesForAdmin);

router.get("/admin/stats", adminAuth, getAdminLeaveStats);

router.get("/admin/:leaveID", adminAuth, getAdminLeaveDetails);

router.patch("/admin/:leaveID/approve", adminAuth, approveLeave);

router.patch("/admin/:leaveID/reject", adminAuth, rejectLeave);

router.get("/:leaveID", auth, authorize("user"), getMyLeaveById);

router.patch("/:leaveID/cancel", auth, authorize("user"), cancelMyLeave);

export default router;