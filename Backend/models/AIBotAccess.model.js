import mongoose from "mongoose";

const aiBotAccessSchema = new mongoose.Schema(
  {
    adminID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      unique: true,
      index: true,
    },
    mode: {
      type: String,
      enum: ["enabled", "disabled_all", "disabled_selected"],
      default: "enabled",
    },
    blockedEmails: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true, versionKey: false },
);

export const AIBotAccessModel = mongoose.model("AIBotAccess", aiBotAccessSchema);
