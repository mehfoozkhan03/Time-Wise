// import { notificationModel } from "../models/Notification.model.js";

// export const getNotifications = async (req, res) => {
//   try {
//     const notifications = await notificationModel
//       .find({ receiverId: req.user.userID })
//       .populate("senderId", "firstName lastName profileImage")
//       .populate("postId", "content image")
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       message: "Notifications fetched successfully.",
//       notifications,
//     });
//   } catch (error) {
//     console.error("Get Notifications Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

import { notificationModel } from "../models/Notification.model.js";
import { notificationStatusModel } from "../models/NotificationStatus.model.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel
      .find({
        deleted: false,
        sender: { $ne: req.user.userID },
      })
      .populate("sender", "firstName lastName profileImage")
      .sort({
        createdAt: -1,
      });

    const statuses = await notificationStatusModel.find({
      userId: req.user.userID,
    });

    const statusMap = new Map();

    statuses.forEach((status) => {
      statusMap.set(
        status.notificationId.toString(),

        status,
      );
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
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

//# Mark Notification as read
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
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// # Delete notification
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
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
