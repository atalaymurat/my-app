const express = require("express");
const router = express.Router();

router.use("/company", require("./company"));
router.use("/contact", require("./contact"));
router.use("/base-product", require("./baseProduct"));
router.use("/option", require("./options"));
router.use("/scrape", require("./scrape"));
router.use("/configuration", require("./configuration"));

module.exports = router;