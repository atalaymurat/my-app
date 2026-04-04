const express = require("express");
const router = express.Router();

router.use("/company", require("./company"));
router.use("/contact", require("./contact"));
router.use("/master", require("./masterProduct"));
router.use("/option", require("./options"));
router.use("/make", require("./make"));
router.use("/scrape", require("./scrape"));
router.use("/offer", require("./offers"));
router.use("/pdf", require("./pdf"));
router.use("/stats", require("./stats"));
router.use("/upload", require("./upload"));

module.exports = router;