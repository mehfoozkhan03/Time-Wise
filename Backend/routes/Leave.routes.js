import express from "express";

import { auth } from "../middleware/AuthMiddleware.js";
import { authorize } from "../middleware/Allowrole.middleware.js";

import {
  createLeave,
  getMyLeaves,
  getMyLeaveById,
  getMyLeaveBalance,
  cancelMyLeave,
} from "../controllers/User/leave.controller.js";

const router = express.Router();

// ================= Employee Leave Routes =================

router.post("/", auth, authorize("user"), createLeave);

router.get("/my", auth, authorize("user"), getMyLeaves);

router.get("/balance", auth, authorize("user"), getMyLeaveBalance);

router.get("/:leaveID", auth, authorize("user"), getMyLeaveById);

router.patch("/:leaveID/cancel", auth, authorize("user"), cancelMyLeave);

export default router;
