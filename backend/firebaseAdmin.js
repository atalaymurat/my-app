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

// Add this middleware function
function authMiddleware(req, res, next) {
  const sessionCookie = req.cookies.session || "";

  if (!sessionCookie) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  adminAuth
    .verifySessionCookie(sessionCookie, true)
    .then((decodedClaims) => {
      if (decodedClaims) {
        req.user = decodedClaims;
        next();
      } else {
        res.status(401).json({ error: "Invalid session" });
      }
    })
    .catch((error) => {
      console.error("Session verification error:", error);
      res.status(401).json({ error: "Session verification failed" });
    });
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
