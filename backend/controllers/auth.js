const admin = require("../config/firebaseAdmin");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Improved cookie configuration
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const optionsLocal = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
  };
  const optionsServer = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    domain: "postiva-server.onrender.com", // backend domaini
    maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
    partitioned: true,
  };

  const options = isProduction ? optionsServer : optionsLocal;
  return options;
};

const getCookieName = () =>
  process.env.NODE_ENV === "production" ? "token" : "token";

module.exports = {
  login: async (req, res) => {
    try {
      const { idToken } = req.body;

      // 1. Input validation
      if (!idToken) {
        return res.status(400).json({
          error: "Authentication required",
          details: "No ID token provided",
        });
      }

      // 2. Verify Firebase ID token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      // Validate required fields
      if (!decodedToken.uid) {
        throw new Error("Invalid Firebase token: missing UID");
      }
      if (!decodedToken) {
        console.log("Invalid Firebase token");
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      console.log("DECODED TOTEN :", decodedToken);

      // Prepare user data from decoded token
      const userData = {
        firebaseUid: decodedToken.uid,
        name: decodedToken.name || decodedToken.email.split("@")[0],
        email: decodedToken.email,
        profilePicture: decodedToken.picture,
        emailVerified: decodedToken.email_verified || false,
        authProvider: decodedToken.firebase?.sign_in_provider || "password",
      };

      // Use the static method
      const user = await User.findOrCreate(userData);

      console.log("User DB Check or create ", JSON.stringify(user, null, 2));

      // 4. Generate JWT token
      const jwtToken = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "5d" }
      );

      // 5. Set secure HTTP-only cookie

      res.cookie(getCookieName(), jwtToken, getCookieOptions());

      console.log(`Successful login for ${user.email}`);
      return res.status(200).json({
        success: true,
        user: user,
      });
    } catch (error) {
      console.error("Login error:", error);
      // Clear cookie if something went wrong
      res.clearCookie("session", getCookieOptions());
      res.clearCookie("__Host-session", getCookieOptions());

      res.status(401).json({
        success: false,
        error: "Login failed",
        details:
          process.env.NODE_ENV !== "production" ? error.message : undefined,
      });
    }
  },

  logout: (req, res) => {
    try {
      const options = getCookieOptions();
      res.clearCookie(getCookieName(), options);
      //    It's good practice to confirm logout was processed.
      return res.status(200).json({
        success: true,
        message: "Logout successful.",
      });
    } catch (error) {
      // 5. Handle potential errors during the process
      console.error("Error during logout:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error during logout.",
      });
    }
  },

  // --- Function to get current user profile based on session cookie ---
  user: async (req, res) => {
    const cookieName = getCookieName();
    try {
      const token = req.cookies[cookieName];

      // 3. If no token is found, the user is not authenticated
      if (!token) {
        console.log("Get User Profile: No session token found.");
        return res.status(401).json({
          success: false,
          error: "Not authenticated",
          details: "No session token found.",
        });
      }

      // 4. Verify the JWT token
      let decodedPayload;
      try {
        // Use the same JWT_SECRET used during login
        decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
      } catch (jwtError) {
        // Handle errors like expired token, invalid signature, etc.
        console.error("JWT Verification Error:", jwtError.message);
        // Clear the invalid cookie
        res.clearCookie(cookieName, getCookieOptions());
        return res.status(401).json({
          success: false,
          error: "Not authenticated",
          details: `Session invalid or expired: ${jwtError.message}`,
        });
      }

      // 5. Fetch the user from the database using the userId from the token payload
      //    Select only the fields you want to send back to the client
      const user = await User.findById(decodedPayload.userId).select(
        "_id email name profilePicture roles isActive createdAt preferences firebaseUid emailVerified" // Added firebaseUid just in case
      );

      console.log("USER CHECK SESSION FIND IN DB::", user?.email);

      // 6. If user not found in DB (edge case, token might be valid but user deleted)
      if (!user) {
        console.error(
          `User not found in DB for valid token userId: ${decodedPayload.userId}`
        );
        // Clear the cookie as it references a non-existent user
        res.clearCookie(getCookieName(), getCookieOptions());
        return res.status(404).json({
          success: false,
          error: "User not found",
          details: "User associated with this session no longer exists.",
        });
      }

      // Optional: Check if user is active
      if (!user.isActive) {
        console.warn(
          `Inactive user attempted to access profile: ${user.email} (ID: ${user._id})`
        );
        // Clear the cookie for inactive user
        res.clearCookie(getCookieName(), getCookieOptions());
        return res.status(403).json({
          success: false,
          error: "Forbidden",
          details: "User account is inactive.",
        });
      }

      // 7. Return the found user data
      console.log(`Successfully fetched profile for user: ${user.email}`);
      return res.status(200).json({
        success: true,
        user: user, // Send the selected user data object
      });
    } catch (error) {
      // 8. Handle any other unexpected errors
      console.error("Get User Profile error:", error);
      // Avoid clearing cookie here unless sure it's related to auth
      return res.status(500).json({
        success: false,
        error: "Internal server error",
        details: "Failed to fetch user profile due to a server issue.",
      });
    }
  },
};
