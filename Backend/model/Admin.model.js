import mongoose, { Schema } from 'mongoose';

const AdminSchema = mongoose.Schema(
  {
    email: String,
    password: String,
  },
  {
    versionKey: false,
  },
);

export const AdminModel = mongoose.model('Admin', AdminSchema);
