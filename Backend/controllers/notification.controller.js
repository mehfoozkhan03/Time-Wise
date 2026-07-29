import { notificationModel } from "../models/Notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel
      .find({ receiverId: req.user.userID })
      .populate("senderId", "firstName lastName profileImage")
      .populate("postId", "content image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully.",
      notifications,
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};