const express = require("express");
const router = express.Router();
const axios = require("axios");
const logger = require("../config/logger");
const { warmPdfService } = require("../utils/serviceWarmer");

const AUTH_BASE = process.env.AUTH_SERVICE_URL;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const proxy = async (req, res, targetPath, retryCount = 0) => {
  const start = Date.now();
  const url = `${AUTH_BASE}${targetPath}`;

  try {
    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      params: req.query,
      headers: {
        "x-internal-api-key": process.env.INTERNAL_API_KEY,
        "cookie": req.headers.cookie || "",
        "content-type": req.headers["content-type"] || "application/json",
        "authorization": req.headers["authorization"] || "",
      },
      timeout: 30000,
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
      warmPdfService();
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
    const isTimeout = err.code === "ECONNABORTED" || err.message.includes("timeout");
    const isRetryable = isTimeout || err.code === "ECONNRESET";

    if (isRetryable && retryCount < 2) {
      logger.warn({
        message: "Auth proxy retry",
        targetPath,
        retryCount: retryCount + 1,
        error: err.message,
      });
      await wait(2000);
      return proxy(req, res, targetPath, retryCount + 1);
    }

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

// Superadmin only
const authenticate = require("../middleware/authenticate");
router.get("/users", authenticate, (req, res) => {
  if (!req.isSuperAdmin) return res.status(403).json({ error: "Sadece superadmin erişebilir." });
  proxy(req, res, "/api/auth/users");
});
router.get("/users/summary", authenticate, (req, res) => {
  if (!req.isSuperAdmin) return res.status(403).json({ error: "Sadece superadmin erişebilir." });
  proxy(req, res, "/api/auth/users/summary");
});
router.patch("/users/:id/activate", authenticate, (req, res) => {
  if (!req.isSuperAdmin) return res.status(403).json({ error: "Sadece superadmin erişebilir." });
  proxy(req, res, `/api/auth/users/${req.params.id}/activate`);
});
router.patch("/users/:id/deactivate", authenticate, (req, res) => {
  if (!req.isSuperAdmin) return res.status(403).json({ error: "Sadece superadmin erişebilir." });
  proxy(req, res, `/api/auth/users/${req.params.id}/deactivate`);
});
router.delete("/users/:id", authenticate, (req, res) => {
  if (!req.isSuperAdmin) return res.status(403).json({ error: "Sadece superadmin erişebilir." });
  proxy(req, res, `/api/auth/users/${req.params.id}`);
});

module.exports = router;
