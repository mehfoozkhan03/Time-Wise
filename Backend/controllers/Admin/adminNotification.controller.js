
import mongoose from "mongoose";
import { userModel } from "../../models/User.model.js";
import { notificationModel } from "../../models/Notification.model.js";
import { createNotification } from "../../services/notification.service.js";

const getAdminId = (req) => req.admin?.adminID;

const getEmployeeFilter = () => ({
  role: { $ne: "Admin" },
});

const getRecipientOptions = async (req, res) => {
  try {
    const search = req.query.search?.trim();

    const filter = getEmployeeFilter();

    if (search) {
      const regex = new RegExp(
        search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { department: regex },
        { designation: regex },
      ];
    }

    const employees = await userModel
      .find(filter)
      .select(
        "_id firstName lastName email department designation role profileImage"
      )
      .sort({ firstName: 1, lastName: 1 })
      .limit(50)
      .lean();

    // Get the complete list of available targeting options,
    // independent of the employee search text.
    const [departments, designations] = await Promise.all([
      userModel.distinct("department", {
        ...getEmployeeFilter(),
        department: { $nin: [null, ""] },
      }),
      userModel.distinct("designation", {
        ...getEmployeeFilter(),
        designation: { $nin: [null, ""] },
      }),
    ]);

    return res.status(200).json({
      success: true,
      employees,
      departments: departments.sort(),
      designations: designations.sort(),
    });
  } catch (error) {
    console.error("getRecipientOptions:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load notification recipients.",
    });
  }
};

const createAdminNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      type = "announcement",
      audienceType,
      targetDepartment,
      targetDesignation,
      targetUserId,
    } = req.body;

    if (!getAdminId(req)) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication details are missing.",
      });
    }

    if (!title?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required.",
      });
    }

    if (!["announcement", "system"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin notification type.",
      });
    }

    if (
      !["all", "department", "designation", "specific"].includes(
        audienceType
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid audience.",
      });
    }

    const employeeFilter = getEmployeeFilter();
    let recipients = [];
    let storedAudienceType = audienceType;
    let department = null;
    let designation = null;

    if (audienceType === "all") {
      recipients = await userModel
        .find(employeeFilter)
        .select("_id")
        .lean();
    }

    if (audienceType === "department") {
      if (!targetDepartment?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please select a department.",
        });
      }

      department = targetDepartment.trim();

      recipients = await userModel
        .find({
          ...employeeFilter,
          department,
        })
        .select("_id")
        .lean();
    }

    if (audienceType === "designation") {
      if (!targetDesignation?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please select a designation.",
        });
      }

      designation = targetDesignation.trim();

      recipients = await userModel
        .find({
          ...employeeFilter,
          designation,
        })
        .select("_id")
        .lean();
    }

    if (audienceType === "specific") {
      if (!mongoose.isValidObjectId(targetUserId)) {
        return res.status(400).json({
          success: false,
          message: "Please select a valid employee.",
        });
      }

      const employee = await userModel
        .findOne({
          _id: targetUserId,
          ...employeeFilter,
        })
        .select("_id")
        .lean();

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "The selected employee was not found.",
        });
      }

      recipients = [employee];
    }

    if (recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No employees match the selected audience.",
      });
    }

    const recipientIds = recipients.map((employee) => employee._id);

    const notification = await createNotification({
      sender: getAdminId(req),
      senderModel: "Admin",
      title: title.trim(),
      message: message.trim(),
      type,
      audienceType: storedAudienceType,
      targetUsers: recipientIds,
      targetDepartment: department,
      targetDesignation: designation,
    });

    return res.status(201).json({
      success: true,
      message: `Notification sent to ${recipientIds.length} employee(s).`,
      notification,
      recipientCount: recipientIds.length,
    });
  } catch (error) {
    console.error("createAdminNotification:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send the notification.",
    });
  }
};

const getAdminSentNotifications = async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      50
    );

    const filter = {
      senderModel: "Admin",
      sender: getAdminId(req),
      isArchived: false,
    };

    const [notifications, total] = await Promise.all([
      notificationModel
        .find(filter)
        .populate({
          path: "sender",
          select: "email",
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      notificationModel.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      notifications,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("getAdminSentNotifications:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load sent notifications.",
    });
  }
};

export {
  getRecipientOptions,
  createAdminNotification,
  getAdminSentNotifications,
};
