import { userModel } from '../models/User.model.js'

export const updateUserDepartment = async (req, res) => {
  try {
    const { userId } = req.params;
    const { department } = req.body;

    const allowedDepartments = [
      "Engineering",
      "Design",
      "HR",
      "Analytics",
      "Marketing",
    ];

    if (!allowedDepartments.includes(department)) {
      return res.status(400).json({
        success: false,
        message: "Invalid department",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      { department },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update department",
    });
  }
};