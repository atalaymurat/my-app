const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/upload");
const { uploadImage } = require("../controllers/uploadController");

// POST /api/upload?folder=logos
router.post("/", authenticate, (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
}, uploadImage);

module.exports = router;
