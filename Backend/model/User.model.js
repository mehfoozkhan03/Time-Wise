import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
    },

    // check_in: String,
    // check_out: String,
    // break_time: String,

    adminID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    attendance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendance",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const userModel = mongoose.model("User", userSchema);
