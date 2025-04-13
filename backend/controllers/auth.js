const admin = require("../config/firebaseAdmin");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    path: "/",
    maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };
};

const setCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Origin",
    isProduction ? process.env.FRONTEND_URL : "http://localhost:3000"
  );

  res.cookie("_api_token", token, getCookieOptions());
};

module.exports = {
  login: async (req, res) => {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({
          error: "Authentication required",
          details: "No ID token provided",
        });
      }

      const decodedToken = await admin.auth().verifyIdToken(idToken);

      if (!decodedToken.uid) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      const userData = {
        firebaseUid: decodedToken.uid,
        name: decodedToken.name || decodedToken.email.split("@")[0],
        email: decodedToken.email,
        profilePicture: decodedToken.picture,
        emailVerified: decodedToken.email_verified || false,
        authProvider: decodedToken.firebase?.sign_in_provider || "password",
      };

      const user = await User.findOrCreate(userData);
      const jwtToken = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "5d" }
      );

      setCookie(res, jwtToken);

      return res.status(200).json({
        success: true,
        user: user,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.clearCookie("_api_token", getCookieOptions());
      return res.status(401).json({
        success: false,
        error: "Login failed",
        details:
          process.env.NODE_ENV !== "production" ? error.message : undefined,
      });
    }
  },

  logout: (req, res) => {
    try {
      res.clearCookie("_api_token", getCookieOptions());
      return res.status(200).json({
        success: true,
        message: "Logout successful.",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error during logout.",
      });
    }
  },

  user: async (req, res) => {
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

      return res.status(200).json({
        success: true,
        user: user,
      });
    } catch (error) {
      console.error("Get User Profile error:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
        details: "Failed to fetch user profile due to a server issue.",
      });
    }
  },

  verify: async (req, res) => {
    try {
      const token = req.cookies._api_token;
      if (!token) {
        return res.status(401).json({ success: false });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const newToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      setCookie(res, newToken);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Verification error:", error);
      return res.status(401).json({ success: false });
    }
  },
};
