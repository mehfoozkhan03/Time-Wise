import mongoose from "mongoose";

const aiMessageSchema = new mongoose.Schema(
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
  {
    _id: false,
  },
);

const aiConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    messages: {
      type: [aiMessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const AIConversation = mongoose.model(
  "AIConversation",
  aiConversationSchema,
);
