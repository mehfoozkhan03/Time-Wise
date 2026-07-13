import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const Connection = async () => {
  try {
    await mongoose.connect(process.env.DataBase, {
      dbName: 'time_wise',
    })

    console.log('MongoDB Connected Successfully ✅')
  } catch (error) {
    console.error('MongoDB Connection Error:')
    console.error(error)
    throw error
  }
}
