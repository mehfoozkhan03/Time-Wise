import mongoose from "mongoose";

const leaveBalanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    annual: {
      total: {
        type: Number,
        default: 26,
        min: 0,
      },
      used: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    sick: {
      total: {
        type: Number,
        default: 8,
        min: 0,
      },
      used: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    casual: {
      total: {
        type: Number,
        default: 5,
        min: 0,
      },
      used: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const leaveBalanceModel = mongoose.model(
  "LeaveBalance",
  leaveBalanceSchema,
);
