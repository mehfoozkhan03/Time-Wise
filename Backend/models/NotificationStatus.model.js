import mongoose from "mongoose";

const notificationStatusSchema = new mongoose.Schema(
  {
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    read: {
      type: Boolean,
      default: false,
    },

    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

notificationStatusSchema.index(
  {
    notificationId: 1,
    userId: 1,
  },
  {
    unique: true,
  },
);

export const notificationStatusModel = mongoose.model("NotificationStatus", notificationStatusSchema);
