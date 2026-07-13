import mongoose from 'mongoose'

const URI =
  'mongodb+srv://arnavkharade:YOUR_PASSWORD@cluster0.t2exduy.mongodb.net/time_wise'

mongoose
  .connect(URI)
  .then(() => {
    console.log('Connected')
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
