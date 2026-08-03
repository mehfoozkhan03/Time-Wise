// import { notificationModel } from "../models/Notification.model.js";

// export const createNotification = async ({
//     sender,
//     title,
//     message,
//     type,
//     referenceId = null,
// }) => {

//     return await notificationModel.create({
//         sender,
//         title,
//         message,
//         type,
//         referenceId,
//     });

// };


import { notificationModel } from "../models/Notification.model.js";

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

  return notification;
};