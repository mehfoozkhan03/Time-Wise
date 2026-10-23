import mongoose from "mongoose";

import {
  createLeaveRequest,
  getEmployeeLeaves,
  getLeaveById,
  getLeaveBalance,
  cancelLeaveRequest,
} from "../../services/leave.service.js";

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
      message: "Leave request submitted successfully.",
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

    const {
      page = 1,
      limit = 10,
      status = "All",
    } = req.query;

    const result = await getEmployeeLeaves({
      userID,
      page,
      limit,
      status,
    });

    return res.status(200).json({
      success: true,
      data: result.requests,
      pagination: result.pagination,
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
