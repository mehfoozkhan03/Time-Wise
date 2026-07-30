import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema(
  {
    /* ==========================
       Holiday Information
    ========================== */

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
        "HOLIDAY",
        "GOVERNMENT_HOLIDAY",
        "FESTIVAL",
        "COMPANY_HOLIDAY",
        "OPTIONAL_HOLIDAY",
      ],
    },

    /* ==========================
       Holiday Date
    ========================== */

    date: {
      type: Date,
      required: true,
    },

    /* ==========================
       Access Control
    ========================== */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
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
  }
);

holidaySchema.index(
  {
    title: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

export const holidayModel = mongoose.model(
  "Holiday",
  holidaySchema
);