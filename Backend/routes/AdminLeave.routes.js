import express from "express";

import { adminAuth } from "../middleware/adminAuth.js";

import {
  getAllLeavesForAdmin,
  getAdminLeaveDetails,
  approveLeave,
  rejectLeave,
  getAdminLeaveStats,
} from "../controllers/Admin/leave.controller.js";

const router = express.Router();

// ================= Admin Leave Routes =================

// Get all employee leave requests
router.get("/", adminAuth, getAllLeavesForAdmin);

// Get leave statistics
router.get("/stats", adminAuth, getAdminLeaveStats);

// Get details of a specific leave request
router.get("/:leaveID", adminAuth, getAdminLeaveDetails);

// Approve a leave request
router.patch("/:leaveID/approve", adminAuth, approveLeave);

// Reject a leave request
router.patch("/:leaveID/reject", adminAuth, rejectLeave);

export default router;