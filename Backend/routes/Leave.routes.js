import express from "express";

import { auth } from "../middleware/AuthMiddleware.js";

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
} from "../controllers/leave.controller.js";

const router = express.Router();

router.post("/", auth, createLeave);

router.get("/my", auth, getMyLeaves);
router.get("/balance", auth, getMyLeaveBalance);

router.get("/admin", auth, getAllLeavesForAdmin);
router.get("/admin/stats", auth, getAdminLeaveStats);
router.get("/admin/:leaveID", auth, getAdminLeaveDetails);

router.patch("/admin/:leaveID/approve", auth, approveLeave);
router.patch("/admin/:leaveID/reject", auth, rejectLeave);

router.get("/:leaveID", auth, getMyLeaveById);
router.patch("/:leaveID/cancel", auth, cancelMyLeave);

export default router;