const express = require("express");
const router = express.Router();

router.use("/company", require("./company"));
router.use("/contact", require("./contact"));
router.use("/master", require("./masterProduct"));
router.use("/option", require("./options"));
router.use("/scrape", require("./scrape"));
router.use("/variant", require("./variant"));
router.use("/offer", require("./offers"));
router.use("/pdf", require("./pdf"));

module.exports = router;