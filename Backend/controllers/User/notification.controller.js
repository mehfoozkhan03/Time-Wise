import { notificationModel } from "../../models/Notification.model.js";
import { notificationStatusModel } from "../../models/NotificationStatus.model.js";

const getEmployeeNotificationFilter = (userId, department) => ({
  isArchived: false,

  $and: [
    {
      $or: [
        { audienceType: "all" },
        { targetUsers: userId },
        // Backward compatibility for older department notifications.
        ...(department
          ? [
              {
                audienceType: "department",
                targetDepartment: department,
              },
            ]
          : []),
      ],
    },

    // Exclude the employee's own notifications but allow admin notices.
    {
      $or: [
        { senderModel: "Admin" },
        {
          senderModel: "User",
          sender: { $ne: userId },
        },
        // Older documents may not contain senderModel.
        {
          senderModel: { $exists: false },
          sender: { $ne: userId },
        },
      ],
    },
  ],
});

// =================== Get Notifications=======================
// export const getNotifications = async (req, res) => {
//   const page = Number(req.query.page) || 1;
//   const limit = Number(req.query.limit) || 10;

//   const skip = (page - 1) * limit;
//   try {
//     const notifications = await notificationModel
//       .find({
//         isArchived: false,

//         sender: {
//           $ne: req.user.userID,
//         },

//         $or: [
//           {
//             audienceType: "all",
//           },

//           {
//             audienceType: "specific",
//             targetUsers: req.user.userID,
//           },
//         ],
//       })
//       .populate("sender", "firstName lastName profileImage")
//       .sort({
//         createdAt: -1,
//       })
//       .skip(skip)
//       .limit(limit);

//     const statuses = await notificationStatusModel.find({
//       userId: req.user.userID,
//     });

//     const totalNotifications = await notificationModel.countDocuments({
//       isArchived: false,

//       sender: {
//         $ne: req.user.userID,
//       },

//       $or: [
//         {
//           audienceType: "all",
//         },
//         {
//           audienceType: "specific",
//           targetUsers: req.user.userID,
//         },
//       ],
//     });

//     const statusMap = new Map();

//     statuses.forEach((status) => {
//       statusMap.set(status.notificationId.toString(), status);
//     });

//     const finalNotifications = [];

//     for (const notification of notifications) {
//       const status = statusMap.get(notification._id.toString());

//       if (status?.deleted) {
//         continue;
//       }

//       finalNotifications.push({
//         ...notification.toObject(),

//         read: status ? status.read : false,
//       });
//     }

//     return res.status(200).json({
//       success: true,

//       notifications: finalNotifications,

//       page,

//       limit,

//       totalNotifications,

//       totalPages: Math.ceil(totalNotifications / limit),

//       hasMore: skip + finalNotifications.length < totalNotifications,
//     });
//   } catch (error) {
//     console.error("Get Notifications Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error.",
//     });
//   }
// };

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userID;
    const department = req.user.department;

    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);

    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      100,
    );

    const skip = (page - 1) * limit;

    // Notifications visible to the logged-in employee.
    const filter = getEmployeeNotificationFilter(userId, department);

    const [notifications, total] = await Promise.all([
      notificationModel
        .find(filter)
        .populate("sender", "firstName lastName profileImage email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      notificationModel.countDocuments(filter),
    ]);

    // Load this employee's individual notification statuses.
    const notificationIds = notifications.map(
      (notification) => notification._id,
    );

    const statuses = await notificationStatusModel
      .find({
        userId,
        notificationId: { $in: notificationIds },
      })
      .lean();

    const statusMap = new Map(
      statuses.map((status) => [status.notificationId.toString(), status]),
    );

    // Exclude notifications deleted by this employee.
    const visibleNotifications = notifications
      .filter((notification) => {
        const status = statusMap.get(notification._id.toString());

        return !status?.deleted;
      })
      .map((notification) => {
        const status = statusMap.get(notification._id.toString());

        return {
          ...notification,
          read: status?.read ?? false,
          deleted: status?.deleted ?? false,
        };
      });

    return res.status(200).json({
      success: true,
      notifications: visibleNotifications,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page < Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("getNotifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch notifications.",
    });
  }
};

// ======================================================
// Mark Notification As Read
// ======================================================

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await notificationStatusModel.findOneAndUpdate(
      {
        notificationId: id,
        userId: req.user.userID,
      },
      {
        $set: {
          read: true,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
    });
  } catch (error) {
    console.error("Read Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ======================================================
// Delete Notification
// ======================================================

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await notificationStatusModel.findOneAndUpdate(
      {
        notificationId: id,
        userId: req.user.userID,
      },
      {
        $set: {
          deleted: true,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

//# ==================== Get Unread Notification Count ==================

// export const getUnreadNotificationCount = async (req, res) => {
//   try {
//     // All active notifications for this user
//     const notifications = await notificationModel.find({
//       isArchived: false,
//       sender: { $ne: req.user.userID },
//       $or: [
//         {
//           audienceType: "all",
//         },
//         {
//           audienceType: "specific",
//           targetUsers: req.user.userID,
//         },
//       ],
//     });

//     const notificationIds = notifications.map(
//       (notification) => notification._id,
//     );

//     // Read OR Deleted notifications
//     const statuses = await notificationStatusModel.find({
//       userId: req.user.userID,
//       notificationId: { $in: notificationIds },
//       $or: [{ read: true }, { deleted: true }],
//     });

//     const unreadCount = notificationIds.length - statuses.length;

//     return res.status(200).json({
//       success: true,
//       unreadCount,
//     });
//   } catch (error) {
//     console.error("Unread Notification Count Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error.",
//     });
//   }
// };



export const getUnreadNotificationCount = async (req, res) => {
  try {
    const userId = req.user.userID;
    const department = req.user.department;

    // Fetch all active notifications visible to this employee.
    const filter = getEmployeeNotificationFilter(
      userId,
      department
    );

    const notifications = await notificationModel
      .find(filter)
      .select("_id")
      .lean();

    const notificationIds = notifications.map(
      (notification) => notification._id
    );

    // No notifications means no unread notifications.
    if (notificationIds.length === 0) {
      return res.status(200).json({
        success: true,
        unreadCount: 0,
      });
    }

    // Find notifications already read or deleted by this employee.
    const statuses = await notificationStatusModel
      .find({
        userId,
        notificationId: { $in: notificationIds },
        $or: [
          { read: true },
          { deleted: true },
        ],
      })
      .select("notificationId")
      .lean();

    const excludedNotificationIds = new Set(
      statuses.map((status) =>
        status.notificationId.toString()
      )
    );

    // Count only notifications that are neither read nor deleted.
    const unreadCount = notificationIds.filter(
      (id) => !excludedNotificationIds.has(id.toString())
    ).length;

    return res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error("Unread Notification Count Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
