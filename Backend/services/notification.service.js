// import { notificationModel } from "../models/Notification.model.js";
// import { getIO, getOnlineUsers, getUserSocket } from "../socket/socket.js";

// export const createNotification = async ({
//   sender,
//   title,
//   message,
//   type,
//   referenceModel = null,
//   referenceId = null,
//   audienceType = "all",
//   targetUsers = [],
//   targetDepartment = null,
// }) => {
//   const notification = await notificationModel.create({
//     sender,
//     title,
//     message,
//     type,
//     referenceModel,
//     referenceId,
//     audienceType,
//     targetUsers,
//     targetDepartment,
//   });

//   const populatedNotification = await notificationModel
//     .findById(notification._id)
//     .populate("sender", "firstName lastName profileImage");

//   // ======================================================
//   // Real-time Notification
//   // ======================================================

//   const io = getIO();

//   if (io) {
//     // Broadcast notification
//     if (audienceType === "all") {
//       const users = getOnlineUsers();

//       for (const [userId, socketId] of users.entries()) {
//         // Don't send notification to sender
//         if (userId !== sender.toString()) {
//           io.to(socketId).emit("new-notification", populatedNotification);
//         }
//       }
//     }

//     // Targeted notification
//     if (audienceType === "specific") {
//       for (const userId of targetUsers) {
//         const socketId = getUserSocket(userId);

//         if (socketId) {
//           io.to(socketId).emit("new-notification", populatedNotification);
//         }
//       }
//     }
//   }

//   return populatedNotification;
// };




import { notificationModel } from "../models/Notification.model.js";
import { notificationStatusModel } from "../models/NotificationStatus.model.js";
import {
  getIO,
  getUserSocket,
} from "../socket/socket.js";

export const createNotification = async ({
  sender,
  senderModel = "User",
  title,
  message,
  type,
  referenceModel = null,
  referenceId = null,
  audienceType = "all",
  targetUsers = [],
  targetDepartment = null,
  targetDesignation = null,
}) => {
  const recipientIds = [
    ...new Set(targetUsers.map((id) => id.toString())),
  ];

  const notification = await notificationModel.create({
    sender,
    senderModel,
    title,
    message,
    type,
    referenceModel,
    referenceId,
    audienceType,
    targetUsers: recipientIds,
    targetDepartment,
    targetDesignation,
  });

  const populatedNotification = await notificationModel
    .findById(notification._id)
    .populate({
      path: "sender",
      select: "firstName lastName profileImage email",
    });

  // Create an individual read/unread status for each recipient.
  if (recipientIds.length > 0) {
    await notificationStatusModel.bulkWrite(
      recipientIds.map((userId) => ({
        updateOne: {
          filter: {
            notificationId: notification._id,
            userId,
          },
          update: {
            $setOnInsert: {
              notificationId: notification._id,
              userId,
              read: false,
              deleted: false,
            },
          },
          upsert: true,
        },
      }))
    );
  }

  // Emit a recipient-specific payload. Do not broadcast targeted
  // notifications to every connected socket.
  const io = getIO();

  if (io) {
    for (const userId of recipientIds) {
      // Prevent a user from receiving their own user-generated notification.
      if (
        senderModel === "User" &&
        userId === sender.toString()
      ) {
        continue;
      }

      const socketId = getUserSocket(userId);

      if (socketId) {
        io.to(socketId).emit("new-notification", {
          ...populatedNotification.toObject(),
          read: false,
          deleted: false,
        });
      }
    }
  }

  return populatedNotification;
};
