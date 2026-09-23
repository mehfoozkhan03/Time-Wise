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

const pendingRequestSchema = new mongoose.Schema(
  {
    intent: {
      type: String,
      required: true,
    },

    entity: {
      type: String,
      default: "none",
    },

    period: {
      type: String,
      default: "none",
    },

    dateReference: {
      type: String,
      default: "none",
    },

    search: {
      type: String,
      default: "none",
    },

    missing: {
      type: String,
      default: null,
    },

    originalQuestion: {
      type: String,
      default: "",
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

    pendingRequests: {
      type: [pendingRequestSchema],
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
