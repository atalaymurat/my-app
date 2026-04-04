const Option = require("../models/options/Option");
const { normalizeOption } = require("../utils/normalize");
const createOption = require("./utils/options/createOption");

module.exports = {
  index: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalRecords = await Option.countDocuments(req.orgFilter);
      const records = await Option.find(req.orgFilter)
        .populate("make", "name")
        .populate({ path: "masterProducts", select: "title make", populate: { path: "make", select: "name" } })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
        options: records,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  create: async (req, res) => {
    try {
      const normalized = normalizeOption(req.body, req.user._id, req.user.orgId);
      const newOption = await createOption(normalized);
      return res.status(200).json({ success: true, option: newOption });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  show: async (req, res) => {
    try {
      const option = await Option.findOne({ _id: req.params.id, ...req.orgFilter })
        .populate("make", "name")
        .populate({ path: "masterProducts", select: "title make", populate: { path: "make", select: "name" } });
      if (!option) return res.status(404).json({ message: "Option not found" });
      res.status(200).json({ success: true, option });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch option", error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const normalized = normalizeOption(req.body, req.user._id, req.user.orgId);
      const option = await Option.findOneAndUpdate(
        { _id: req.params.id, ...req.orgFilter },
        normalized,
        { new: true }
      );
      if (!option) return res.status(404).json({ message: "Option not found" });
      res.status(200).json({ success: true, option });
    } catch (err) {
      res.status(400).json({ message: "Failed to update option", error: err.message });
    }
  },

  destroy: async (req, res) => {
    try {
      const option = await Option.findOneAndDelete({ _id: req.params.id, ...req.orgFilter });
      if (!option) return res.status(404).json({ message: "Option not found" });
      res.status(200).json({ success: true, message: "Option deleted" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete option", error: err.message });
    }
  },

  make: async (req, res) => {
    try {
      const records = await Option.find({ ...req.orgFilter, make: req.params.id });
      res.status(200).json({ success: true, options: records });
    } catch (err) {
      res.status(500).json({ error: err.message, success: false });
    }
  },

  list: async (req, res) => {
    try {
      const records = await Option.find({
        ...req.orgFilter,
        masterProducts: { $in: [req.params.id] },
      });
      const list = records.map((record) => ({
        value: record._id.toString(),
        label: record.title,
        listPrice: record.priceList || 0,
        offerPrice: record.priceOffer || 0,
        netPrice: record.priceNet || 0,
        currency: record.currency,
        desc: record.description,
      }));
      res.status(200).json({ success: true, list });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
};
