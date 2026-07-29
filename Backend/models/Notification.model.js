import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    receiverId: {
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

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: "Admin",
      ref: "User"
    },

    deleted: {
      type: Boolean,
      default: false,
    },
    // To know who has posted thought
    postID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const notificationModel = mongoose.model("Notification", notificationSchema);