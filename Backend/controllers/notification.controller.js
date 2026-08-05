import { notificationModel } from "../models/Notification.model.js";
import { notificationStatusModel } from "../models/NotificationStatus.model.js";

// ======================================================
// Get Notifications
// ======================================================

export const getNotifications = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;
  try {
    const notifications = await notificationModel
      .find({
        isArchived: false,

        sender: {
          $ne: req.user.userID,
        },

        $or: [
          {
            audienceType: "all",
          },

          {
            audienceType: "specific",
            targetUsers: req.user.userID,
          },
        ],
      })
      .populate("sender", "firstName lastName profileImage")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const statuses = await notificationStatusModel.find({
      userId: req.user.userID,
    });

    const totalNotifications = await notificationModel.countDocuments({
      isArchived: false,

      sender: {
        $ne: req.user.userID,
      },

      $or: [
        {
          audienceType: "all",
        },
        {
          audienceType: "specific",
          targetUsers: req.user.userID,
        },
      ],
    });

    const statusMap = new Map();

    statuses.forEach((status) => {
      statusMap.set(status.notificationId.toString(), status);
    });

    const finalNotifications = [];

    for (const notification of notifications) {
      const status = statusMap.get(notification._id.toString());

      if (status?.deleted) {
        continue;
      }

      finalNotifications.push({
        ...notification.toObject(),

        read: status ? status.read : false,
      });
    }

    return res.status(200).json({
      success: true,

      notifications: finalNotifications,

      page,

      limit,

      totalNotifications,

      totalPages: Math.ceil(totalNotifications / limit),

      hasMore: skip + finalNotifications.length < totalNotifications,
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
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

// ======================================================
// Get Unread Notification Count
// ======================================================

export const getUnreadNotificationCount = async (req, res) => {
  try {
    // All active notifications for this user
    const notifications = await notificationModel.find({
      isArchived: false,
      sender: { $ne: req.user.userID },
      $or: [
        {
          audienceType: "all",
        },
        {
          audienceType: "specific",
          targetUsers: req.user.userID,
        },
      ],
    });

    const notificationIds = notifications.map(
      (notification) => notification._id,
    );

    // Read OR Deleted notifications
    const statuses = await notificationStatusModel.find({
      userId: req.user.userID,
      notificationId: { $in: notificationIds },
      $or: [{ read: true }, { deleted: true }],
    });

    const unreadCount = notificationIds.length - statuses.length;

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
