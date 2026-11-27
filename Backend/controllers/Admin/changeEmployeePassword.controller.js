import { userModel } from './../../models/User.model.js';
import bcrypt from 'bcrypt';
import { createNotification } from '../../services/notification.service.js';


export const changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    await user.save();

    await createNotification({
      sender: req.admin.adminID,
      senderModel: "Admin",
      title: "Password changed",
      message: "An administrator changed your TimeWise account password. If you did not expect this, contact your administrator.",
      type: "system",
      preferenceKey: "profileChanges",
      audienceType: "specific",
      targetUsers: [user._id],
      critical: true,
    });

    return res.status(200).json({
      success: true,
      message: "Employee password changed successfully.",
    });
  } catch (error) {
    console.error("Change employee password error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change employee password.",
    });
  }
};
