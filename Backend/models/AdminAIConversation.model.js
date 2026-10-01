import mongoose from "mongoose";

const adminAIMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const adminAIConversationSchema = new mongoose.Schema(
  {
    adminID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      unique: true,
      index: true,
    },
    messages: {
      type: [adminAIMessageSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export const AdminAIConversation = mongoose.model(
  "AdminAIConversation",
  adminAIConversationSchema,
);
