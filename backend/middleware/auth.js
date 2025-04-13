const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const domain = isProduction ? ".postiva-server.onrender.com" : undefined;

  return {
    httpOnly: true,
    secure: isProduction,
    path: "/",
    sameSite: isProduction ? "none" : "lax",
    domain: isProduction ? domain : undefined,
    maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
  };
};

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies._api_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated",
        details: "No session token found.",
      });
    }

    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedPayload.userId).select(
      "_id email name profilePicture roles isActive createdAt preferences firebaseUid emailVerified"
    );

    if (!user) {
      res.clearCookie("_api_token", getCookieOptions());
      return res.status(404).json({
        success: false,
        error: "User not found",
        details: "User associated with this session no longer exists.",
      });
    }

    if (!user.isActive) {
      res.clearCookie("_api_token", getCookieOptions());
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
    res.clearCookie("_api_token", getCookieOptions());
    return res.status(401).json({
      success: false,
      error: "Authentication failed",
      details: "Invalid or expired token.",
    });
  }
};

module.exports = { authenticate }; 