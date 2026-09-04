import express from "express";

import { auth } from "../middleware/AuthMiddleware.js";
import { authorize } from "../middleware/Allowrole.middleware.js";

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

router.post("/", auth,authorize("user"), createLeave);

router.get("/my", auth,authorize("user"),getMyLeaves);
router.get("/balance", auth,authorize("user"), getMyLeaveBalance);

router.get("/admin", auth,authorize("admin"), getAllLeavesForAdmin);
router.get("/admin/stats", auth,authorize("admin"), getAdminLeaveStats);
router.get("/admin/:leaveID", auth,authorize("admin"), getAdminLeaveDetails);

router.patch("/admin/:leaveID/approve", auth,authorize("admin"), approveLeave);
router.patch("/admin/:leaveID/reject", auth,authorize("admin"), rejectLeave);

router.get("/:leaveID", auth,authorize("user"), getMyLeaveById);
router.patch("/:leaveID/cancel", auth,authorize("user"), cancelMyLeave);

export default router;