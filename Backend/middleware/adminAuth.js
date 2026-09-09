import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
  try {
    const adminToken = req.cookies?.adminToken;

    if (!adminToken) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required.",
      });
    }

    jwt.verify(adminToken, process.env.PrivateKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired admin token.",
        });
      }

      if (decoded.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Admin access required.",
        });
      }

      req.admin = decoded;
      next();
    });
  } catch (error) {
    console.error("Admin Auth Middleware Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
