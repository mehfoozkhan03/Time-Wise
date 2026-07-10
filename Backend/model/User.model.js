import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ================= Basic Information =================

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },


    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    dob: {
      type: String,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    role: {
      type: String,
      enum: ["employee", "admin"],
      default: "employee",
    },

    // ================= Organization =================

    department: {
      type: String,
      default: "",
    },

    designation: {
      type: String,
      default: "",
    },

    // ================= Profile =================

    profileImage: {
      type: String,
      default: "",
    },

    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },

    // ================= Relations =================

    adminID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
    attendance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendance",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const userModel = mongoose.model("User", userSchema);
