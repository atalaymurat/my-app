const admin = require("../config/firebaseAdmin");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

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
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
        path: "/",
        ...(process.env.NODE_ENV === "production" && {
          domain: process.env.COOKIE_DOMAIN,
        }),
      };

      res.cookie(
        process.env.NODE_ENV === "production" ? "__Host-session" : "session",
        jwtToken,
        cookieOptions
      );

      console.log(`Successful login for ${user.email}`);
      return res.status(200).json({
        success: true,
        user: user,
      });
    } catch (error) {
      console.error("Login error:", error);
      // Clear cookie if something went wrong
      res.clearCookie("session");
      res.clearCookie("__Host-session");

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
      // 1. Determine the correct cookie name based on environment
      //    This MUST exactly match the name used in the login function.
      const cookieName =
        process.env.NODE_ENV === "production" ? "__Host-session" : "session";

      // 2. Define cookie options used for clearing
      //    These attributes (path, domain, secure, httpOnly, sameSite) MUST precisely match
      //    the ones used when the cookie was SET during login for the browser to clear it.
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Should match login setting
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Should match login setting
        path: "/", // Must match the path used in login ('/' is common)

        // Include domain only if it was set during login (typically only in production)
        ...(process.env.NODE_ENV === "production" &&
          process.env.COOKIE_DOMAIN && {
            domain: process.env.COOKIE_DOMAIN,
          }),
      };

      // 3. Clear the cookie
      //    Express's res.clearCookie() method sets the cookie's expiration date to the past,
      //    prompting the browser to remove it.
      res.clearCookie(cookieName, cookieOptions);

      console.log(`Logout successful: Cleared cookie '${cookieName}'`);

      // 4. Send success response
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
    let cookieName; // Declare here to be accessible in catch block if needed
    try {
      // 1. Determine the correct cookie name
      cookieName =
        process.env.NODE_ENV === "production" ? "__Host-session" : "session";

      // 2. Get the token from the request cookies
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
        const cookieOptions = {
          // Define options for clearing
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
          path: "/",
          ...(process.env.NODE_ENV === "production" &&
            process.env.FRONTEND_URL && {
              domain: process.env.FRONTEND_URL,
            }),
        };
        res.clearCookie(cookieName, cookieOptions);
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

      console.log("USER CHECK SESSION FIND IN DB::", user);

      // 6. If user not found in DB (edge case, token might be valid but user deleted)
      if (!user) {
        console.error(
          `User not found in DB for valid token userId: ${decodedPayload.userId}`
        );
        // Clear the cookie as it references a non-existent user
        const cookieOptions = {
          // Define options for clearing
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
          path: "/",
          ...(process.env.NODE_ENV === "production" &&
            process.env.FRONTEND_URL && {
              domain: process.env.FRONTEND_URL,
            }),
        };
        res.clearCookie(cookieName, cookieOptions);
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
        const cookieOptions = {
          /* ... same options ... */
        }; // Define options again
        res.clearCookie(cookieName, cookieOptions);
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
