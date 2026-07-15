import express from 'express'

const postRoutes = express.Router()

console.log('✅ Post.routes.js loaded')

postRoutes.use((req, res, next) => {
  console.log('POST ROUTER HIT:', req.method, req.originalUrl)
  next()
})

postRoutes.get('/test', (req, res) => {
  res.send('TEST WORKS')
})

postRoutes.get('/featured', (req, res) => {
  res.send('FEATURED WORKS')
})

postRoutes.post('/', (req, res) => {
  res.send('CREATE WORKS')
})

export { postRoutes }
