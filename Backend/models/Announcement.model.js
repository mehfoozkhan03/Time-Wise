import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    // ================= BASIC INFORMATION =================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Company",
        "Holiday",
        "Policy",
        "Event",
        "Important",
        "HR",
        "Attendance",
        "Training",
        "Payroll",
        "Maintenance",
      ],
    },

    priority: {
      type: String,
      enum: ["Normal", "Important", "Urgent"],
      default: "Normal",
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // ================= PUBLISHING =================

    status: {
      type: String,
      enum: [
        "Draft",
        "Published",
        "Scheduled",
        "Expired",
      ],
      default: "Draft",
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    scheduledAt: {
      type: Date,
      default: null,
    },

    // ================= EXPIRY =================

    expiryDate: {
      type: Date,
      default: null,
    },

    expiryTime: {
      type: String,
      default: null,
    },

    // ================= AUDIENCE =================

    audience: {
      type: String,
      enum: [
        "Everyone",
        "Department",
        "Role",
        "Specific Employees",
      ],
      default: "Everyone",
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    role: {
      type: String,
      default: null,
    },

    specificEmployees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ================= ATTACHMENTS =================

    attachments: [
      {
        name: {
          type: String,
          required: true,
        },

        url: {
          type: String,
          required: true,
        },

        size: {
          type: Number,
          default: 0,
        },

        type: {
          type: String,
          default: null,
        },

        publicId: {
          type: String,
          default: null,
        },
      },
    ],

    // ================= ACTION BUTTON =================

    actionButton: {
      enabled: {
        type: Boolean,
        default: false,
      },

      label: {
        type: String,
        default: null,
      },

      url: {
        type: String,
        default: null,
      },
    },

    // ================= PIN =================

    isPinned: {
      type: Boolean,
      default: false,
    },

    // ================= CREATED BY =================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const annoucementModel =  mongoose.model("Announcement", announcementSchema);