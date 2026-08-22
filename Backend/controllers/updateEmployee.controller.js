import { userModel } from "../models/User.model.js";

export const updateEmployee = async (req, res) => {
  try {
    const { userId } = req.params;

    const { firstName, lastName, department, designation, role } = req.body;

    const allowedDepartments = [
      "Engineering",
      "Design",
      "HR",
      "Analytics",
      "Marketing",
    ];

    const allowedRoles = ["Employee", "Manager", "Admin"];

    if (department && !allowedDepartments.includes(department)) {
      return res.status(400).json({
        success: false,
        message: "Invalid department",
      });
    }

    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        department,
        designation,
        role,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      user,
    });
  } catch (error) {
    console.error("UPDATE EMPLOYEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update employee",
      error: error.message,
    });
  }
};
