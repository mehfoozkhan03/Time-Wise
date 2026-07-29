import { userModel } from "../models/User.model.js";
import { notificationModel } from "../models/Notification.model.js"

export const sendNotificationToUsers = async ({
  sender,
  title,
  message,
  type,
  excludeUser = null,
}) => {
  const query = {};

  if (excludeUser) {
    query._id = { $ne: excludeUser };
  }

  const users = await userModel.find(query).select("_id");

  const notifications = users.map((user) => ({
    userId: user._id,
    sender,
    title,
    message,
    type,
  }));

  await notificationModel.insertMany(notifications);
};
