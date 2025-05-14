const User = require("../models/User");
const {
  verifyFirebaseToken,
  createToken,
  verifyToken,
} = require("shared-auth");

module.exports = {
  login: async (req, res) => {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        return res.status(400).json({ error: "No ID token provided" });
      }

      const decodedToken = await verifyFirebaseToken(idToken);
      if (!decodedToken?.uid) {
        return res.status(401).json({ error: "Invalid Firebase token" });
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
      const token = createToken(user);
      console.log("Response From login:", token);

      return res.status(200).json({
        success: true,
        accessToken: token,
        user,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(401).json({ error: "Login failed" });
    }
  },

  logout: async (_req, res) => {
    // Bearer token client tarafında silinecek. API tarafında işlem gerekmez.
    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  },

  user: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token);

      const user = await User.findById(decoded.userId).select(
        "_id email name profilePicture roles isActive createdAt preferences firebaseUid emailVerified",
      );

      if (!user || !user.isActive) {
        return res.status(403).json({ error: "User not found or inactive" });
      }

      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.error("User fetch error:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },
};
