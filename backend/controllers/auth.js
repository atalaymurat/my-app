const { createSessionCookie, verifyIdToken } = require("../firebaseAdmin");

module.exports = {
  login: async (req, res) => {
    try {
      const { idToken } = req.body;
      console.log(
        "Login attempt with ID token:",
        idToken ? "received" : "missing"
      );

      if (!idToken) {
        return res.status(400).json({
          error: "Authentication required",
          details: "No ID token provided",
        });
      }

      // Create session cookie (5 days expiration)
      const expiresIn = 5 * 24 * 60 * 60 * 1000;
      const sessionCookie = await createSessionCookie(idToken, expiresIn);
      console.log("Session cookie created", sessionCookie);

      // Cookie configuration
      const isProduction = process.env.NODE_ENV === "production";
      const cookieOptions = {
        maxAge: expiresIn,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        domain: isProduction ? ".yourdomain.com" : undefined,
      };

      // Get user data
      const decodedToken = await verifyIdToken(idToken);
      const userData = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified || false,
        displayName: decodedToken.name || decodedToken.email.split("@")[0],
      };

      // Set headers and cookie
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.cookie(
        isProduction ? "__Host-session" : "session",
        sessionCookie,
        cookieOptions
      );

      console.log("Login successful for user:", userData.email);
      res.status(200).json({ success: true, user: userData });
    } catch (error) {
      console.error("Login error:", error);
      res.status(401).json({
        error: "Login failed",
        details:
          process.env.NODE_ENV !== "production" ? error.message : undefined,
      });
    }
  },

  logout: (req, res) => {
    // Clear both possible cookie names
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      path: "/",
      domain: isProduction ? ".yourdomain.com" : undefined,
    };

    res.clearCookie("session", cookieOptions);
    res.clearCookie("__Host-session", cookieOptions);

    res.status(200).json({ success: true });
  },

  userProfile: (req, res) => {
    try {
      if (!req.user) {
        throw new Error("User data not found in request");
      }
      res.status(200).json({ user: req.user });
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  },
};
