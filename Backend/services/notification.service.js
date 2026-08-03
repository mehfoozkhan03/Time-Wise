import { notificationModel } from "../models/Notification.model.js";
import { getIO, getUserSocket } from "../socket/socket.js";

export const createNotification = async ({
  sender,
  title,
  message,
  type,
  referenceModel = null,
  referenceId = null,
  audienceType = "all",
  targetUsers = [],
  targetDepartment = null,
}) => {
  const notification = await notificationModel.create({
  sender,
  title,
  message,
  type,
  referenceModel,
  referenceId,
  audienceType,
  targetUsers,
  targetDepartment,
  
});

const populatedNotification = await notificationModel
  .findById(notification._id)
  .populate("sender", "firstName lastName profileImage");

  // ======================================================
  // Real-time Notification
  // ======================================================

  const io = getIO();

  if (io) {
    // Broadcast notification
    if (audienceType === "all") {
      io.emit("new-notification", populatedNotification);
    }

    // Targeted notification
    if (audienceType === "specific") {
      for (const userId of targetUsers) {
        const socketId = getUserSocket(userId);

        if (socketId) {
          io.to(socketId).emit("new-notification", populatedNotification);
        }
      }
    }
  }

  return populatedNotification;
};
