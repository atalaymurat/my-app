const express = require("express");
const router = express.Router();

router.use("/company", require("./company"));
router.use("/contact", require("./contact"));
router.use("/base-product", require("./baseProduct"));
router.use("/scrape", require("./scrape"));

module.exports = router;