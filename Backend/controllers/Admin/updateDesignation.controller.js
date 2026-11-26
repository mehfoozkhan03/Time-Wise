import {userModel} from "../../models/User.model.js";
import { createNotification } from "../../services/notification.service.js";

export const updateUserDesignation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { designation } = req.body;

    const allowedDesignations = [
      "Software Developer",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "UI/UX Designer",
      "HR Executive",
      "Data Analyst",
      "Marketing Executive",
    ];

    if (!allowedDesignations.includes(designation)) {
      return res.status(400).json({
        success: false,
        message: "Invalid designation",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      { designation },
      { returnDocument: "after" }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await createNotification({
      sender: req.admin.adminID,
      senderModel: "Admin",
      title: "Designation updated",
      message: `Your designation was changed to ${designation}.`,
      type: "system",
      preferenceKey: "profileChanges",
      audienceType: "specific",
      targetUsers: [user._id],
    });

    return res.status(200).json({
      success: true,
      message: "Designation updated successfully",
      user,
    });
  } catch (error) {
    console.error("UPDATE DESIGNATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update designation",
      error: error.message,
    });
  }
};
