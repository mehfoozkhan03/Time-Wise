// import mongoose, { Schema } from 'mongoose';

// const AdminSchema = mongoose.Schema(
//   {
//     email: String,
//     password: String,
//   },
//   {
//     versionKey: false,
//   },
// );

// export const AdminModel = mongoose.model('Admin', AdminSchema);

import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
  },
  {
    versionKey: false,
  },
);

export const AdminModel = mongoose.model("Admin", AdminSchema);
