const express = require("express");
const router = express.Router();
const axios = require("axios");
const logger = require("../config/logger");

const AUTH_BASE = process.env.AUTH_SERVICE_URL;

const proxy = async (req, res, targetPath) => {
  const start = Date.now();
  const url = `${AUTH_BASE}${targetPath}`;

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

    const duration = Date.now() - start;

    if (targetPath.includes("/login") && response.status === 200) {
      logger.info({
        message: "User login",
        email: req.body?.email,
        success: response.data?.success,
        duration,
      });
    } else if (targetPath.includes("/logout")) {
      logger.info({
        message: "User logout",
        duration,
      });
    } else if (targetPath.includes("/verify") && response.status !== 200) {
      logger.warn({
        message: "Auth verify failed",
        status: response.status,
        duration,
      });
    }

    res.status(response.status).json(response.data);
  } catch (err) {
    logger.error({
      message: "Auth proxy error",
      targetPath,
      error: err.message,
    });
    res.status(503).json({ success: false, message: "Auth service unavailable" });
  }
};

router.post("/login",   (req, res) => proxy(req, res, "/api/auth/login"));
router.post("/verify",  (req, res) => proxy(req, res, "/api/auth/verify"));
router.post("/logout",  (req, res) => proxy(req, res, "/api/auth/logout"));
router.post("/refresh", (req, res) => proxy(req, res, "/api/auth/refresh"));
router.get("/health",   (req, res) => proxy(req, res, "/api/auth/health"));

module.exports = router;
