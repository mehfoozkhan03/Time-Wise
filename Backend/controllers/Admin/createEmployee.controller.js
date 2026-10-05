import bcrypt from "bcrypt";
import { userModel } from "../../models/User.model.js";

export const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      dob,
      gender,
      department,
      designation,
      role,
    } = req.body;

    // ================= Validation =================

    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !password?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, email and password are required.",
      });
    }

    // ================= Check Existing User =================

    const existingUser = await userModel.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    // ================= Hash Password =================

    const salt = await bcrypt.genSalt(+process.env.saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ================= Create Employee =================

    const employee = await userModel.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,

      dob: dob || null,
      gender: gender || null,

      role: role || "Employee",
      department: department || null,
      designation: designation || null,

      theme: "system",
    });

    const user = employee.toObject();

    delete user.password;

    return res.status(201).json({
      success: true,
      message: "Employee created successfully.",
      user,
    });
  } catch (error) {
    console.error("Create Employee Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email is already in use.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Please check the employee information.",
        reason: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create employee.",
      reason:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again later.",
    });
  }
};