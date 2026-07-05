import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "attendance",
        "post",
        "announcement",
        "leave",
        "system",
      ],
      default: "system",
    },

    read: {
      type: Boolean,
      default: false,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const notificationModel =
  mongoose.model("Notification", notificationSchema);