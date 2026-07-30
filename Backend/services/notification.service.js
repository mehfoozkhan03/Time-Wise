import { notificationModel } from "../models/Notification.model.js";

export const createNotification = async ({
    sender,
    title,
    message,
    type,
    referenceId = null,
}) => {

    return await notificationModel.create({
        sender,
        title,
        message,
        type,
        referenceId,
    });

};