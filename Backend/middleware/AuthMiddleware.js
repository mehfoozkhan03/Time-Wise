import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.cookies?.adminToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required,",
      });
    }

    jwt.verify(token, process.env.PrivateKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token.",
        });
      }
      console.log("decoded", decoded);
      // Store decoded data according to role
      if (decoded.role === "admin") {
        req.AdminUser = decoded;
      } else if (decoded.role === "user") {
        req.user = decoded;
      } else {
        return res.status(403).json({
          success: false,
          message: "Invalid user role.",
        });
      }
      next();
    });
  } catch (error) {
    console.error("Auth Middleware Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
