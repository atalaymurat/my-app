// middleware/authenticate.js
const axios = require("axios");

const authenticate = async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const response = await axios.post(`${process.env.AUTH_SERVICE_URL}/verify`, {
      applicationId: process.env.APPLICATION_ID,
    }, {
      headers: { Cookie: `accessToken=${token}` },
    });

    if (response.status === 200 && response.data?.success) {
      req.user = response.data.user
      return next();
    }

    return res.status(401).json({ error: "Unauthorized" });
  } catch (err) {
    console.error("Token verification failed:", err.response?.data || err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticate;