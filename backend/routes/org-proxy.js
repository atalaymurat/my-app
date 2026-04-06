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

    console.log(`[ORG-PROXY] ${req.method} ${targetPath} → ${response.status} (${Date.now() - start}ms)`);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(`[ORG-PROXY] ${req.method} ${targetPath} → ERROR (${Date.now() - start}ms):`, err.message);
    res.status(503).json({ success: false, message: "Auth service unavailable" });
  }
};

router.post("/create",                  (req, res) => proxy(req, res, "/api/org/create"));
router.get("/me",                       (req, res) => proxy(req, res, "/api/org/me"));
router.post("/invite",                  (req, res) => proxy(req, res, "/api/org/invite"));
router.patch("/member/:userId/role",    (req, res) => proxy(req, res, `/api/org/member/${req.params.userId}/role`));
router.patch("/update",                 (req, res) => proxy(req, res, "/api/org/update"));
router.patch("/:id/offer-defaults",     (req, res) => proxy(req, res, `/api/org/${req.params.id}/offer-defaults`));
router.patch("/:id/bank-accounts",      (req, res) => proxy(req, res, `/api/org/${req.params.id}/bank-accounts`));

module.exports = router;
