import { userModel } from "../../models/User.model.js";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  mergeNotificationPreferences,
  sanitizeNotificationPreferences,
} from "../../config/notificationPreferences.js";

export const getNotificationPreferences = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userID).select("notificationPreferences").lean();
    if (!user) return res.status(404).json({ success: false, message: "Employee not found." });
    return res.status(200).json({
      success: true,
      preferences: mergeNotificationPreferences(user.notificationPreferences),
    });
  } catch (error) {
    console.error("Get Notification Preferences Error:", error);
    return res.status(500).json({ success: false, message: "Unable to load notification preferences." });
  }
};

export const updateNotificationPreferences = async (req, res) => {
  try {
    const updates = sanitizeNotificationPreferences(req.body?.preferences ?? req.body);
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No valid notification preferences were provided." });
    }
    const user = await userModel.findById(req.user.userID).select("notificationPreferences");
    if (!user) return res.status(404).json({ success: false, message: "Employee not found." });
    user.notificationPreferences = {
      ...DEFAULT_NOTIFICATION_PREFERENCES,
      ...user.notificationPreferences?.toObject?.(),
      ...updates,
    };
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Notification preferences saved.",
      preferences: mergeNotificationPreferences(user.notificationPreferences),
    });
  } catch (error) {
    console.error("Update Notification Preferences Error:", error);
    return res.status(500).json({ success: false, message: "Unable to save notification preferences." });
  }
};
