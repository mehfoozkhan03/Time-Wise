import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
  },
  {
    versionKey: false,
  },
);

export const userModel = mongoose.model('User', userSchema);
