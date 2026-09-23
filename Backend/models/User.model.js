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

    name: {
      type: String,
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
      enum: ["Admin", "Manager", "Employee"],
      default: "Employee",
    },

    // ================= Organization =================

    department: {
      type: String,
      default: null,
    },

    designation: {
      type: String,
      default: null,
    },
    lastActiveAt: {
      type: Date,
      default: null,
    },

    // ================= Profile =================

    profileImage: {
      type: String,
      default: null,
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

    // notifications: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Notification',
    //   },
    // ],

    attendance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendance",
      },
    ],

    // =============== Social Links ==================
    socialLinks: {
      linkedin: {
        type: String,
        default: "",
        trim: true,
      },
      github: {
        type: String,
        default: "",
        trim: true,
      },
      portfolio: {
        type: String,
        default: "",
        trim: true,
      },
    },

    // Emergency contact
    emergencyContact: {
      name: {
        type: String,
        default: "",
        trim: true,
      },
      relationship: {
        type: String,
        default: "",
        trim: true,
      },
      phone: {
        type: String,
        default: "",
        trim: true,
      },
      email: {
        type: String,
        default: "",
        trim: true,
        lowercase: true,
      },
    },
  },

  {
    timestamps: true,
    versionKey: false,
  },
);

export const userModel = mongoose.model("User", userSchema);
