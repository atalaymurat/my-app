const Make = require("../models/Make");
const cloudinary = require("../config/cloudinary");
const { extractCloudinaryPublicId } = require("./utils/cloudinaryPublicId");

module.exports = {
  index: async (req, res) => {
    try {
      const records = await Make.find({}).sort({ name: 1 });
      return res.status(200).json({ success: true, records, makes: records });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  show: async (req, res) => {
    try {
      const make = await Make.findById(req.params.id);
      if (!make) return res.status(404).json({ success: false, message: "Bulunamadı." });
      res.json({ success: true, record: make, make });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  create: async (req, res) => {
    try {
      const newMake = await Make.create({
        ...req.body,
        createdBy: req.user._id,
      });
      return res.status(201).json({ success: true, record: newMake, make: newMake });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  update: async (req, res) => {
    try {
      const make = await Make.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!make) return res.status(404).json({ success: false, message: "Bulunamadı." });
      res.json({ success: true, record: make, make });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  destroy: async (req, res) => {
    try {
      const make = await Make.findByIdAndDelete(req.params.id);
      if (!make) return res.status(404).json({ success: false, message: "Bulunamadı." });

      if (make.logo) {
        const publicId = extractCloudinaryPublicId(make.logo);
        if (publicId) cloudinary.uploader.destroy(publicId).catch(() => {});
      }

      res.json({ success: true, message: "Silindi." });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
};
