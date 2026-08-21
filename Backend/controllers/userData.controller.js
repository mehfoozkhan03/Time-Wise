import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { userModel } from "../models/User.model.js";
import { AdminModel } from "../models/Admin.model.js";

// ================= Validation =================

const validateSignup = (body) => {
  return (
    body.firstName?.trim() &&
    body.lastName?.trim() &&
    body.email?.trim() &&
    body.password?.trim()
  );
};

const validateLogin = (body) => {
  return body.email?.trim() && body.password?.trim();
};

// ================= Signup =================

export const signup = async (req, res) => {
  try {
    if (!validateSignup(req.body)) {
      return res.status(400).json({
        success: false,
        title: "Signup Failed",
        message: "Please fill all required fields.",
        reason: "One or more required fields are empty.",
      });
    }

    const existingUser = await userModel.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        title: "Account Already Exists",
        message: "User already exists. Please login.",
        reason: "Please sign in instead or use another email address.",
      });
    }

    const admins = await AdminModel.find();

    const salt = await bcrypt.genSalt(+process.env.saltRounds);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const userCreated = await userModel.create({
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),

      email: req.body.email.trim().toLowerCase(),

      password: hashedPassword,

      dob: req.body.dob || null,

      gender: req.body.gender || null,

      role: req.body.role || "employee",

      department: req.body.department || null,

      designation: req.body.designation || null,

      profileImage: req.body.profileImage || null,

      theme: req.body.theme || "system",

      adminID: admins[0]?._id ?? null,
    });

    const user = userCreated.toObject();

    delete user.password;

    return res.status(201).json({
      success: true,
      title: "Welcome to TimeWise!",
      message: "Your account has been created successfully.",
      description: "You can now sign in and start using TimeWise.",
      reason: "Your account is ready to use.",
      user,
    });
  } catch (error) {
    console.error("Signup Error:", error);

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

    // Check if it's a validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        title: "Validation Error",
        message: "Please check your input.",
        reason: Object.values(error.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      title: "Something Went Wrong",
      message: "An unexpected error occurred during signup.",
      reason:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again in a few moments.",
    });
  }
};

// ================= User Login =================

export const login = async (req, res) => {
  try {
    if (!validateLogin(req.body)) {
      return res.status(400).json({
        success: false,
        title: "Login Failed",
        message: "Email and password are required.",
        reason: "Please enter both your email address and password.",
      });
    }

    const userData = await userModel.findOne({
      email: req.body.email.trim().toLowerCase(),
    });

    if (!userData) {
      return res.status(404).json({
        success: false,
        title: "Account Not Found",
        message: "No account was found with this email.",
        reason: "Check the email address or create a new account.",
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, userData.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        title: "Login Failed",
        message: "Incorrect password.",
        reason: "The password you entered is incorrect.",
      });
    }

    userData.lastActiveAt = new Date();
    await userData.save();

    const token = jwt.sign(
      {
        userID: userData._id,
      },
      process.env.PrivateKey,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const user = userData.toObject();

    delete user.password;

    return res.status(200).json({
      success: true,
      title: "Welcome Back!",
      message: "Login successful.",
      description: "Redirecting you to your home...",
      reason: "You have been successfully authenticated.",
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);

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

    // Check if it's a JWT error
    if (error.name === "JsonWebTokenError") {
      return res.status(500).json({
        success: false,
        title: "Authentication Error",
        message: "Failed to generate authentication token.",
        reason: "Please try logging in again.",
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      title: "Something Went Wrong",
      message: "An unexpected error occurred during login.",
      reason:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again in a few moments.",
    });
  }
};

// ================= Admin Login =================

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

// ================= Current User =================

export const getCurrentUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userID).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        title: "Account Not Found",
        message: "No account was found.",
        reason: "Your account may have been deleted or is inaccessible.",
      });
    }

    return res.status(200).json({
      success: true,
      title: "Profile Loaded",
      message: "User profile loaded successfully.",
      description: "Latest profile information has been retrieved.",
      reason: "Your profile is up to date.",
      user,
    });
  } catch (error) {
    console.error("Get Current User Error:", error);

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
      message: "An unexpected error occurred while fetching your profile.",
      reason:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again in a few moments.",
    });
  }
};

// ================= User Status ==================
export const updateActivity = async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(req.user.userID, {
      lastActiveAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Activity updated",
    });
  } catch (error) {
    console.error("Update Activity Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update activity",
    });
  }
};

// ========================= Get All Usres ============================

// export const getAllUser = async (req, res) => {
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const searchQuery = search
//       ? {
//           $or: [
//             {
//               firstName: {
//                 $regex: search,
//                 $options: "i",
//               },
//             },
//             {
//               lastName: {
//                 $regex: search,
//                 $options: "i",
//               },
//             },
//           ],
//         }
//       : {};

//     const users = await userModel
//       .find(searchQuery)
//       .select("-password")
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

      

//       const totalUsers = await userModel.countDocuments(searchQuery);

//     const usersWithStatus = users.map((user) => {
//       const isOnline =
//         user.lastActiveAt &&
//         Date.now() - new Date(user.lastActiveAt).getTime() < 60000;

//       return {
//         ...user.toObject(),
//         isOnline,
//       };
//     });

//     res.status(200).json({
//       success: true,
//       message: "User Fetched Successfully",
//       users: usersWithStatus,
//       totalUsers,
//       page,
//       limit,
//       searchQuery
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch users",
//       error: error.message,
//     });
//   }
// };

export const getAllUser = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const searchQuery = search
      ? {
          $or: [
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
          ],
        }
      : {};

    const users = await userModel
      .find(searchQuery)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await userModel.countDocuments(searchQuery);

    const usersWithStatus = users.map((user) => {
      const isOnline =
        user.lastActiveAt &&
        Date.now() - new Date(user.lastActiveAt).getTime() < 60000;

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

// ================= Community Profile =================

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel
      .findById(userId)
      .select(
        "_id firstName lastName designation department profileImage createdAt lastActiveAt",
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        title: "User Not Found",
        message: "The requested user profile was not found.",
        reason: "The user may have been deleted or does not exist.",
      });
    }

    return res.status(200).json({
      success: true,
      title: "Profile Loaded",
      message: "User profile loaded successfully.",
      user,
    });
  } catch (error) {
    console.error("Get User Profile Error:", error);

    return res.status(500).json({
      success: false,
      title: "Something Went Wrong",
      message: "Unable to load user profile.",
      reason: error.message,
    });
  }
};

// ================= Theme Update =================

export const updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;

    // Validate theme
    const allowedThemes = ["light", "dark", "system"];

    if (!allowedThemes.includes(theme)) {
      return res.status(400).json({
        success: false,
        title: "Invalid Theme",
        message: "The selected theme is not valid.",
        reason: `Please choose from: ${allowedThemes.join(", ")}`,
      });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.userID,
      { theme },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        title: "Account Not Found",
        message: "No account was found.",
        reason: "Your account may have been deleted or is inaccessible.",
      });
    }

    return res.status(200).json({
      success: true,
      title: "Theme Updated",
      message: "Your appearance settings have been saved.",
      description: `Theme changed to ${updatedUser.theme}.`,
      reason: "Your preference has been successfully updated.",
      theme: updatedUser.theme,
    });
  } catch (error) {
    console.error("Update Theme Error:", error);

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
      message: "An unexpected error occurred while updating your theme.",
      reason:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again in a few moments.",
    });
  }
};

// ================= Logout =================

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    });

    return res.status(200).json({
      success: true,
      title: "See You Soon!",
      message: "You have been logged out successfully.",
      description: "Have a wonderful day. We look forward to seeing you again!",
      reason: "You have been successfully logged out.",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      title: "Something Went Wrong",
      message: "An unexpected error occurred during logout.",
      reason:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again in a few moments.",
    });
  }
};
