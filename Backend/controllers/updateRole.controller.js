import { userModel } from "../models/User.model.js";

export const updateRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        message: "Role is required",
      });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        role,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update role error:", error);

    return res.status(500).json({
      message: "Failed to update role",
      error: error.message,
    });
  }
};