// middleware/authenticate.js
const axios = require("axios");

const authenticate = async (req, res, next) => {
  console.log("✅ AUTHENTICATE MIDDLEWARE");
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized Middleware Authorization Cancel the Request" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const response = await axios.post(`${process.env.AUTH_SERVICE_URL}/verify`, {
      token,
      applicationId: process.env.APPLICATION_ID,
    });

    if (response.status === 200 && response.data?.success) {
      req.user = response.data.user
      console.log("User verified:", req.user);
      return next();
    }

    return res.status(401).json({ error: "Unauthorized" });
  } catch (err) {
    console.error("Token verification failed:", err.response?.data || err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticate;