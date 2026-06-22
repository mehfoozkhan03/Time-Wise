import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const Connection = async () => {
  return await mongoose.connect(process.env.DataBase);
};
