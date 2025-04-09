//backend/firebaseAdmin.js
const { initializeApp, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const admin = require("firebase-admin");

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

if (!getApps().length) {
  initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Initialized.");
}

const adminAuth = getAuth();

// Add this function to create session cookies
async function createSessionCookie(
  idToken,
  expiresIn = 5 * 24 * 60 * 60 * 1000
) {
  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });
    return sessionCookie;
  } catch (error) {
    console.error("Session cookie creation failed:", error);
    throw error;
  }
}

async function authMiddleware(req, res, next) {
  // Check for session cookie in both possible locations
  const sessionCookie = req.cookies["__Host-session"] || req.cookies.session;

  if (!sessionCookie) {
    console.log("No session cookie found");
    return res.status(401).json({
      error: "Unauthorized",
      details: "No authentication token provided",
    });
  }

  try {
    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true // check revoked
    );

    if (!decodedClaims) {
      return res.status(401).json({
        error: "Invalid session",
        details: "Token verification failed",
      });
    }

    // Attach user data to request
    req.user = {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      emailVerified: decodedClaims.email_verified || false,
      displayName: decodedClaims.name || decodedClaims.email.split("@")[0],
    };

    next();
  } catch (error) {
    console.error("Session verification error:", error);

    // Clear invalid cookie
    res.clearCookie("session");
    res.clearCookie("__Host-session");

    return res.status(401).json({
      error: "Session expired",
      details: "Please login again",
    });
  }
}

async function verifyIdToken(token) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

module.exports = {
  adminAuth,
  verifyIdToken,
  createSessionCookie,
  authMiddleware,
};
