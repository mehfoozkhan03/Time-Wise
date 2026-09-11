import { AdminModel } from "../../models/Admin.model.js";
import { userModel } from "../../models/User.model.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const validateLogin = (body) => {
  return body.email?.trim() && body.password?.trim();
};

//# ================= Admin Login =================
export const admin_login = async (req, res) => {
  try {
    if (!validateLogin(req.body)) {
      return res.status(400).json({
        success: false,
        title: "Login Failed",
        message: "Email and password are required.",
        reason: "Please enter both your email address and password.",
      });
    }

    const admin = await AdminModel.findOne({
      email: req.body.email,
      role: "admin",
    });
    console.log(`🚀 ~ admin:`, admin);

    if (!admin) {
      return res.status(404).json({
        success: false,
        title: "Account Not Found",
        message: "No account was found with this email.",
        reason: "Check the email address or create an admin account.",
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        title: "Login Failed",
        message: "Incorrect password.",
        reason: "The password you entered is incorrect.",
      });
    }

    const token = jwt.sign(
      {
        adminID: admin._id,
        userEmail: admin.email,
        role: "admin",
      },
      process.env.PrivateKey,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("adminToken", token, {
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const user = admin.toObject();

    delete user.password;

    return res.status(200).json({
      success: true,
      title: "Welcome Back Admin!",
      message: "Admin Login successful.",
      description: "Redirecting you to your home...",
      reason: "You have been successfully authenticated as admin.",
      user,
      role: "admin",
    });
  } catch (error) {
    console.error("Admin Login Error:", error);

    // Check if it's a MongoDB connection error
    if (error.name === "MongooseError" || error.message.includes("connect")) {
      return res.status(500).json({
        success: false,
        title: "Database Connection Error",
        message: "Unable to connect to the database.",
        reason:
          "The server encountered a database issue. Please try again in a moment.",
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      title: "Something Went Wrong",
      message: "An unexpected error occurred during admin login.",
      reason:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again in a few moments.",
    });
  }
};




//# ========================= Get All Usres ============================

export const getAllUser = async (req, res) => {
  
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search = req.query.search || "";
    const department = req.query.department || "All";
    const status = req.query.status || "All";

    const skip = (page - 1) * limit;

    // ================= Search Filter =================

    const filter = {};

    if (search) {
      filter.$or = [
        {
          firstName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    //# ================= Department Filter =================

    if (department !== "All") {
      filter.department = department;
    }

    //# ================= Status Filter =================
    const ACTIVE_TIME = 15 * 60 * 1000;

    if (status === "Active") {
      filter.lastActiveAt = {
        $gte: new Date(Date.now() - ACTIVE_TIME),
      };
    }

    if (status === "Inactive") {
      filter.$or = [...(filter.$or || [])];

      filter.lastActiveAt = {
        $lt: new Date(Date.now() - ACTIVE_TIME),
      };
    }

    //# ================= Get Users =================

    const users = await userModel
      .find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    //# ================= Total Users =================

    const totalUsers = await userModel.countDocuments(filter);

    //# ================= Online Status =================

    const usersWithStatus = users.map((user) => {
      const isOnline =
        user.lastActiveAt &&
        Date.now() - new Date(user.lastActiveAt).getTime() < 15 * 60 * 1000;

      return {
        ...user.toObject(),
        isOnline,
      };
    });

    return res.status(200).json({
      success: true,
      message: "User Fetched Successfully",
      users: usersWithStatus,
      totalUsers,
      page,
      limit,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};