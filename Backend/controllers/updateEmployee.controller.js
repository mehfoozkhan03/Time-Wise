import { userModel } from "../models/User.model.js";

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      firstName,
      lastName,
      department,
      designation,
      role
    } = req.body;

    if (
      !firstName?.trim() ||
      !lastName?.trim()
      
    ) {
      return res.status(400).json({
        message: "Names fields are required",
      });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        department,
        designation,
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
    console.error("Update user error:", error);

    return res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
};