const router = require("express").Router();
const authenticate = require("../middleware/authenticate");
const adminOnly = require("../middleware/adminOnly");
const { check } = require("../controllers/healthController");

router.get("/", authenticate, adminOnly, check);

module.exports = router;
