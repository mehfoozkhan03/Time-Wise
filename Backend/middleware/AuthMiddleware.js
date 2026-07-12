import jwt from 'jsonwebtoken'
import { decode } from 'node:punycode'

export const auth = (req, res, next) => {
  try {
    const token = req.cookis.token

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required,',
      })
    }

    jwt.verify(token, process.env.PrivateKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token.',
        })
      }

      req.user = decoded

      next()
    })
  } catch (error) {
    console.error('Auth Middleware Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    })
  }
}
