import mongoose from "mongoose";

import {
  createLeaveRequest,
  getEmployeeLeaves,
  getLeaveById,
  getLeaveBalance,
  cancelLeaveRequest,
  getAllLeaveRequests,
  getAdminLeaveById,
  getLeaveStatistics,
  approveLeaveRequest,
  rejectLeaveRequest,
} from "../services/leave.service.js";

export const createLeave = async (req, res) => {
  try {
    const userID = req.user.userID;

    const {
      leaveType,
      startDate,
      endDate,
      reason,
    } = req.body;

    const leave = await createLeaveRequest({
      userID,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    return res.status(201).json({
      success: true,
      message:
        "Leave request submitted successfully.",
      data: leave,
    });
  } catch (error) {
    console.error("Create Leave Error:", error);

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create leave request.",
    });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const userID = req.user.userID;

    const leaves = await getEmployeeLeaves(userID);

    return res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    console.error("Get My Leaves Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch leave requests.",
    });
  }
};

export const getMyLeaveById = async (req, res) => {
  try {
    const userID = req.user.userID;
    const { leaveID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(leaveID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid leave ID.",
      });
    }

    const leave = await getLeaveById(
      leaveID,
      userID,
    );

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: leave,
    });
  } catch (error) {
    console.error(
      "Get Leave Details Error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch leave details.",
    });
  }
};

export const getMyLeaveBalance = async (
  req,
  res,
) => {
  try {
    const userID = req.user.userID;

    const balance = await getLeaveBalance(userID);

    return res.status(200).json({
      success: true,
      data: balance,
    });
  } catch (error) {
    console.error(
      "Get Leave Balance Error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch leave balance.",
    });
  }
};

export const cancelMyLeave = async (req, res) => {
  try {
    const userID = req.user.userID;
    const { leaveID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(leaveID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid leave ID.",
      });
    }

    const leave = await cancelLeaveRequest(
      leaveID,
      userID,
    );

    return res.status(200).json({
      success: true,
      message:
        "Leave request cancelled successfully.",
      data: leave,
    });
  } catch (error) {
    console.error(
      "Cancel Leave Error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to cancel leave request.",
    });
  }
};

export const getAllLeavesForAdmin = async (
  req,
  res,
) => {
  try {
    if (!req.user?.adminID) {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    const {
      page = 1,
      limit = 10,
      status = "All",
      search = "",
    } = req.query;

    const result = await getAllLeaveRequests({
      page,
      limit,
      status,
      search,
    });

    return res.status(200).json({
      success: true,
      data: result.requests,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error(
      "Get All Leaves Error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch leave requests.",
    });
  }
};

export const getAdminLeaveDetails = async (
  req,
  res,
) => {
  try {
    if (!req.user?.adminID) {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    const { leaveID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(leaveID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid leave ID.",
      });
    }

    const leave =
      await getAdminLeaveById(leaveID);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: leave,
    });
  } catch (error) {
    console.error(
      "Get Admin Leave Details Error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch leave details.",
    });
  }
};

export const approveLeave = async (req, res) => {
  try {
    if (!req.user?.adminID) {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    const { leaveID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(leaveID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid leave ID.",
      });
    }

    const leave = await approveLeaveRequest(
      leaveID,
      req.user.adminID,
    );

    return res.status(200).json({
      success: true,
      message:
        "Leave request approved successfully.",
      data: leave,
    });
  } catch (error) {
    console.error(
      "Approve Leave Error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to approve leave request.",
    });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    if (!req.user?.adminID) {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    const { leaveID } = req.params;
    const { adminComment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(leaveID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid leave ID.",
      });
    }

    const leave = await rejectLeaveRequest(
      leaveID,
      req.user.adminID,
      adminComment,
    );

    return res.status(200).json({
      success: true,
      message:
        "Leave request rejected successfully.",
      data: leave,
    });
  } catch (error) {
    console.error(
      "Reject Leave Error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to reject leave request.",
    });
  }
};

export const getAdminLeaveStats = async (
  req,
  res,
) => {
  try {
    if (!req.user?.adminID) {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    const statistics =
      await getLeaveStatistics();

    return res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.error(
      "Get Leave Statistics Error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch leave statistics.",
    });
  }
};