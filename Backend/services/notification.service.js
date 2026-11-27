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
import { userModel } from "../models/User.model.js";
import { getIO, getUserSocket } from "../socket/socket.js";
import {
  mergeNotificationPreferences,
  isWithinQuietHours,
  isMutedForWeekend,
} from "../config/notificationPreferences.js";
import { sendNotificationEmail } from "./notificationEmail.service.js";

const getPreferenceKey = (type, title, requestedKey) => {
  if (requestedKey) return requestedKey;
  if (type === "announcement") return "companyAnnouncements";
  if (type === "leave") return "leaveStatusUpdates";
  if (type === "attendance") return "checkInReminder";
  if (type === "post" && /thought/i.test(title || "")) return "dailyThoughts";
  return null;
};

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
  preferenceKey = null,
  deduplicationKey = null,
  critical = false,
  allowSelf = false,
}) => {
  let requestedRecipientIds = [...new Set(targetUsers.map((id) => id.toString()))];

  // Some existing broadcast call sites do not pass their recipient list.
  if (requestedRecipientIds.length === 0 && audienceType === "all") {
    const senderUser = senderModel === "User"
      ? await userModel.findById(sender).select("adminID").lean()
      : null;
    const organizationFilter = senderUser?.adminID ? { adminID: senderUser.adminID } : {};
    const recipients = await userModel.find({
      role: { $ne: "Admin" },
      _id: senderModel === "User" ? { $ne: sender } : { $exists: true },
      ...organizationFilter,
    }).select("_id").lean();
    requestedRecipientIds = recipients.map((recipient) => recipient._id.toString());
  }

  if (requestedRecipientIds.length === 0) return null;

  const resolvedPreferenceKey = getPreferenceKey(type, title, preferenceKey);
  const recipients = await userModel.find({ _id: { $in: requestedRecipientIds } })
    .select("_id email firstName lastName notificationPreferences")
    .lean();
  const eligibleRecipients = recipients.filter((recipient) => {
    const preferences = mergeNotificationPreferences(recipient.notificationPreferences);
    const categoryEnabled = !resolvedPreferenceKey || preferences[resolvedPreferenceKey] !== false;
    return categoryEnabled && (preferences.inAppAlerts || preferences.pushNotifications || preferences.emailNotifications);
  });
  if (eligibleRecipients.length === 0) return null;

  const recipientIds = eligibleRecipients.map((recipient) => recipient._id.toString());
  let notification;
  try {
    if (deduplicationKey) {
      notification = await notificationModel.findOne({ deduplicationKey });
      if (notification) return notification;
    }
    notification = await notificationModel.create({
      sender,
      senderModel,
      title,
      message,
      type,
      preferenceKey: resolvedPreferenceKey,
      critical,
      allowSelf,
      deduplicationKey,
      referenceModel,
      referenceId,
      audienceType,
      targetUsers: recipientIds,
      targetDepartment,
      targetDesignation,
    });
  } catch (error) {
    if (deduplicationKey && error.code === 11000) {
      return notificationModel.findOne({ deduplicationKey });
    }
    throw error;
  }

  const populatedNotification = await notificationModel
    .findById(notification._id)
    .populate({ path: "sender", select: "firstName lastName profileImage email" });

  await notificationStatusModel.bulkWrite(
    recipientIds.map((userId) => ({
      updateOne: {
        filter: { notificationId: notification._id, userId },
        update: { $setOnInsert: { notificationId: notification._id, userId, read: false, deleted: false } },
        upsert: true,
      },
    })),
  );

  const io = getIO();
  for (const recipient of eligibleRecipients) {
    const recipientId = recipient._id.toString();
    const preferences = mergeNotificationPreferences(recipient.notificationPreferences);
    const quiet = !critical && (preferences.quietMode || isWithinQuietHours(preferences) || isMutedForWeekend(preferences));
    const isOwnEvent = !allowSelf && senderModel === "User" && recipientId === sender.toString();

    if (!isOwnEvent && (preferences.inAppAlerts || preferences.pushNotifications) && !quiet && io) {
      const socketId = getUserSocket(recipientId);
      if (socketId) {
        io.to(socketId).emit("new-notification", {
          ...populatedNotification.toObject(),
          read: false,
          deleted: false,
        });
      }
    }

    if (!isOwnEvent && preferences.emailNotifications && preferences.emailFrequency === "instant") {
      if (quiet) {
        await userModel.updateOne(
          { _id: recipient._id },
          { $addToSet: { pendingNotificationEmails: notification._id } },
        );
      } else {
        sendNotificationEmail({
          recipient,
          title,
          message,
          appUrl: process.env.FRONTEND_URL || "http://localhost:5173",
        }).then(async (delivered) => {
          if (delivered) {
            await userModel.updateOne(
              { _id: recipient._id },
              { $pull: { pendingNotificationEmails: notification._id } },
            );
          } else {
            await userModel.updateOne(
              { _id: recipient._id },
              { $addToSet: { pendingNotificationEmails: notification._id } },
            );
          }
        }).catch(async (error) => {
          console.error("Notification email delivery failed:", error.message);
          await userModel.updateOne(
            { _id: recipient._id },
            { $addToSet: { pendingNotificationEmails: notification._id } },
          );
        });
      }
    }
  }

  return populatedNotification;
};
