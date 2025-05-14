const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("AUTH MIDDLEWARE AUTH HEADER: ", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated",
        details: "Authorization header missing or malformed.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("AUTH MIDDLEWARE DECODED: ", decoded);

    const user = await User.findById(decoded.userId).select(
      "_id email name profilePicture roles isActive createdAt preferences firebaseUid emailVerified"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        details: "User associated with this token does not exist.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        details: "User account is inactive.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      success: false,
      error: "Authentication failed",
      details: "Invalid or expired token.",
    });
  }
};

module.exports = { authenticate };
