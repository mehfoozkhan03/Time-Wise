import { leaveModel } from "../models/Leave.model.js";
import { leaveBalanceModel } from "../models/LeaveBalance.model.js";
import { userModel } from "../models/User.model.js";

const leaveBalanceMap = {
  annual: "annual",
  sick: "sick",
  casual: "casual",
};

const leaveStatuses = ["Pending", "Approved", "Rejected", "Cancelled"];

export const calculateLeaveDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (end < start) {
    throw new Error("End date cannot be before start date.");
  }

  const difference = end.getTime() - start.getTime();

  return Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;
};

export const getOrCreateLeaveBalance = async (userID) => {
  let balance = await leaveBalanceModel.findOne({
    user: userID,
  });

  if (!balance) {
    balance = await leaveBalanceModel.create({
      user: userID,
    });
  }

  return balance;
};

export const getAvailableBalance = (balance, leaveType) => {
  const balanceKey = leaveBalanceMap[leaveType];

  if (!balanceKey || !balance[balanceKey]) {
    throw new Error("Invalid leave type.");
  }

  return balance[balanceKey].total - balance[balanceKey].used;
};

export const createLeaveRequest = async ({
  userID,
  leaveType,
  startDate,
  endDate,
  reason,
}) => {
  if (!leaveBalanceMap[leaveType]) {
    throw new Error("Invalid leave type.");
  }

  if (!reason || !reason.trim()) {
    throw new Error("Leave reason is required.");
  }

  const totalDays = calculateLeaveDays(startDate, endDate);

  const balance = await getOrCreateLeaveBalance(userID);

  const availableBalance = getAvailableBalance(balance, leaveType);

  if (totalDays > availableBalance) {
    throw new Error("Requested days exceed available leave balance.");
  }

  const overlappingLeave = await leaveModel.findOne({
    user: userID,
    status: {
      $in: ["Pending", "Approved"],
    },
    startDate: {
      $lte: new Date(endDate),
    },
    endDate: {
      $gte: new Date(startDate),
    },
  });

  if (overlappingLeave) {
    throw new Error("You already have a leave request for these dates.");
  }

  return await leaveModel.create({
    user: userID,
    leaveType,
    startDate,
    endDate,
    totalDays,
    reason: reason.trim(),
    status: "Pending",
  });
};

export const getEmployeeLeaves = async (userID) => {
  return await leaveModel
    .find({
      user: userID,
    })
    .sort({
      createdAt: -1,
    });
};

export const getLeaveById = async (leaveID, userID) => {
  return await leaveModel.findOne({
    _id: leaveID,
    user: userID,
  });
};

export const cancelLeaveRequest = async (leaveID, userID) => {
  const leave = await leaveModel.findOne({
    _id: leaveID,
    user: userID,
  });

  if (!leave) {
    throw new Error("Leave request not found.");
  }

  if (leave.status !== "Pending") {
    throw new Error("Only pending leave requests can be cancelled.");
  }

  leave.status = "Cancelled";
  leave.cancelledAt = new Date();

  await leave.save();

  return leave;
};

export const approveLeaveRequest = async (leaveID, adminID) => {
  const leave = await leaveModel.findById(leaveID);

  if (!leave) {
    throw new Error("Leave request not found.");
  }

  if (leave.status !== "Pending") {
    throw new Error("Only pending leave requests can be approved.");
  }

  const balance = await getOrCreateLeaveBalance(leave.user);

  const balanceKey = leaveBalanceMap[leave.leaveType];

  if (!balanceKey || !balance[balanceKey]) {
    throw new Error("Invalid leave type.");
  }

  const availableBalance = balance[balanceKey].total - balance[balanceKey].used;

  if (leave.totalDays > availableBalance) {
    throw new Error("Insufficient leave balance.");
  }

  balance[balanceKey].used += leave.totalDays;

  await balance.save();

  leave.status = "Approved";
  leave.approvedBy = adminID;
  leave.approvedAt = new Date();

  await leave.save();

  return leave;
};

export const rejectLeaveRequest = async (
  leaveID,
  adminID,
  adminComment = "",
) => {
  const leave = await leaveModel.findById(leaveID);

  if (!leave) {
    throw new Error("Leave request not found.");
  }

  if (leave.status !== "Pending") {
    throw new Error("Only pending leave requests can be rejected.");
  }

  leave.status = "Rejected";
  leave.rejectedBy = adminID;
  leave.rejectedAt = new Date();
  leave.adminComment = adminComment.trim();

  await leave.save();

  return leave;
};

export const getLeaveBalance = async (userID) => {
  const balance = await getOrCreateLeaveBalance(userID);

  return {
    annual: {
      total: balance.annual.total,
      used: balance.annual.used,
      remaining: balance.annual.total - balance.annual.used,
    },

    sick: {
      total: balance.sick.total,
      used: balance.sick.used,
      remaining: balance.sick.total - balance.sick.used,
    },

    casual: {
      total: balance.casual.total,
      used: balance.casual.used,
      remaining: balance.casual.total - balance.casual.used,
    },
  };
};

export const getAllLeaveRequests = async ({
  page = 1,
  limit = 10,
  status = "All",
  search = "",
} = {}) => {
  const currentPage = Math.max(Number(page) || 1, 1);

  const pageLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const skip = (currentPage - 1) * pageLimit;

  const filter = {};

  if (status && status !== "All" && leaveStatuses.includes(status)) {
    filter.status = status;
  }

  const currentSearch = search.trim();

  if (currentSearch) {
    const escapedSearch = currentSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const searchRegex = new RegExp(escapedSearch, "i");

    const matchingUsers = await userModel.find(
      {
        $or: [
          {
            firstName: searchRegex,
          },
          {
            lastName: searchRegex,
          },
          {
            email: searchRegex,
          },
          {
            department: searchRegex,
          },
          {
            designation: searchRegex,
          },
        ],
      },
      {
        _id: 1,
      },
    );

    const matchingUserIDs = matchingUsers.map((user) => user._id);

    filter.$or = [
      {
        user: {
          $in: matchingUserIDs,
        },
      },
      {
        leaveType: searchRegex,
      },
    ];
  }

  const [requests, total] = await Promise.all([
    leaveModel
      .find(filter)
      .populate("user", "firstName lastName email department designation")
      .populate("approvedBy", "firstName lastName email")
      .populate("rejectedBy", "firstName lastName email")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(pageLimit),

    leaveModel.countDocuments(filter),
  ]);

  return {
    requests,
    pagination: {
      page: currentPage,
      limit: pageLimit,
      total,
      totalPages: Math.ceil(total / pageLimit),
    },
  };
};

export const getAdminLeaveById = async (leaveID) => {
  return await leaveModel
    .findById(leaveID)
    .populate("user", "firstName lastName email department designation")
    .populate("approvedBy", "firstName lastName email")
    .populate("rejectedBy", "firstName lastName email");
};

export const getLeaveStatistics = async () => {
  const [total, pending, approved, rejected, cancelled] = await Promise.all([
    leaveModel.countDocuments(),

    leaveModel.countDocuments({
      status: "Pending",
    }),

    leaveModel.countDocuments({
      status: "Approved",
    }),

    leaveModel.countDocuments({
      status: "Rejected",
    }),

    leaveModel.countDocuments({
      status: "Cancelled",
    }),
  ]);

  return {
    total,
    pending,
    approved,
    rejected,
    cancelled,
  };
};
