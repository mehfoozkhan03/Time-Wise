import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "PRESENT",
        "LEAVE",
        "BIRTHDAY",
        "HOLIDAY",
        "GOVERNMENT_HOLIDAY",
        "FESTIVAL",
        "WORK_EVENT",
        "SPECIAL_EVENT",
        "REVIEW",
        "DEADLINE",
        "CLIENT_MEETING",
        "TRAINING",
        "MEETING",
        "PERSONAL",
      ],
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      default: "",
    },

    endTime: {
      type: String,
      default: "",
    },

    isAllDay: {
      type: Boolean,
      default: false,
    },

    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    employeeName: {
      type: String,
      default: "",
      trim: true,
    },

    department: {
      type: String,
      default: null,
    },

    designation: {
      type: String,
      default: null,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },

    color: {
      type: String,
      default: "",
    },

    visibility: {
      type: String,
      enum: ["PUBLIC", "PRIVATE"],
      default: "PRIVATE",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    createdByModel: {
      type: String,
      enum: ["User", "Admin"],
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    updatedByModel: {
      type: String,
      enum: ["User", "Admin"],
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const calendarModel = mongoose.model("CalendarEvent", calendarSchema);