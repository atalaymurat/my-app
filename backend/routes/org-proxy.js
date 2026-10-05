const express = require("express");
const router = express.Router();
const axios = require("axios");
const logger = require("../config/logger");

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

    logger.info({ message: "Org proxy request", method: req.method, targetPath, status: response.status, duration: Date.now() - start });
    res.status(response.status).json(response.data);
  } catch (err) {
    const isTimeout = err.code === "ECONNABORTED" || err.message.includes("timeout");
    const isRetryable = isTimeout || err.code === "ECONNRESET";

    if (isRetryable && retryCount < 2) {
      logger.warn({
        message: "Org proxy retry",
        targetPath,
        retryCount: retryCount + 1,
        error: err.message,
      });
      await wait(2000);
      return proxy(req, res, targetPath, retryCount + 1);
    }

    logger.error({ message: "Org proxy error", method: req.method, targetPath, error: err.message });
    res.status(503).json({ success: false, message: "Auth service unavailable" });
  }
};

router.post("/create",                  (req, res) => proxy(req, res, "/api/org/create"));
router.get("/me",                       (req, res) => proxy(req, res, "/api/org/me"));
router.get("/list",                     (req, res) => proxy(req, res, "/api/org/list"));
router.post("/invite",                  (req, res) => proxy(req, res, "/api/org/invite"));
router.patch("/member/:userId/role",    (req, res) => proxy(req, res, `/api/org/member/${req.params.userId}/role`));
router.patch("/update",                 (req, res) => proxy(req, res, "/api/org/update"));
router.patch("/:id/offer-defaults",     (req, res) => proxy(req, res, `/api/org/${req.params.id}/offer-defaults`));
router.patch("/:id/bank-accounts",      (req, res) => proxy(req, res, `/api/org/${req.params.id}/bank-accounts`));

module.exports = router;
