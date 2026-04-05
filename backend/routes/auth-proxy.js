const express = require("express");
const router = express.Router();
const axios = require("axios");

const AUTH_BASE = () =>
  process.env.AUTH_SERVICE_URL.replace(/\/api\/auth\/?$/, "");

const proxy = async (req, res, targetPath) => {
  const start = Date.now();
  const url = `${AUTH_BASE()}${targetPath}`;

  try {
    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: {
        "x-internal-api-key": process.env.INTERNAL_API_KEY,
        "cookie": req.headers.cookie || "",
        "content-type": req.headers["content-type"] || "application/json",
        "authorization": req.headers["authorization"] || "",
      },
      validateStatus: () => true,
    });

    const setCookie = response.headers["set-cookie"];
    if (setCookie) res.setHeader("Set-Cookie", setCookie);

    console.log(`[AUTH-PROXY] ${req.method} ${targetPath} → ${response.status} (${Date.now() - start}ms)`);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(`[AUTH-PROXY] ${req.method} ${targetPath} → ERROR (${Date.now() - start}ms):`, err.message);
    res.status(503).json({ success: false, message: "Auth service unavailable" });
  }
};

router.post("/login",   (req, res) => proxy(req, res, "/api/auth/login"));
router.post("/verify",  (req, res) => proxy(req, res, "/api/auth/verify"));
router.post("/logout",  (req, res) => proxy(req, res, "/api/auth/logout"));
router.post("/refresh", (req, res) => proxy(req, res, "/api/auth/refresh"));
router.get("/health",   (req, res) => proxy(req, res, "/api/auth/health"));

module.exports = router;
