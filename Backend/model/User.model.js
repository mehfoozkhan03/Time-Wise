import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    dob: String,
    gender: String,
    // createdAt: new Date().toISOString(),
  },
  {
    versionKey: false,
  },
);

export const userModel = mongoose.model('User', userSchema);
