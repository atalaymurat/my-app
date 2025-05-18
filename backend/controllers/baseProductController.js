const normalizeData = require("./utils/baseProduct/normalizeData");
const createBaseProduct = require("./utils/baseProduct/createBaseProduct");
const BaseProduct = require("../models/baseProduct/BaseProduct");

module.exports = {
  index: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const filter = { user: req.user._id };

      const totalRecords = await BaseProduct.countDocuments(filter);
      const records = await BaseProduct.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      return res.status(200).json({
        message: "Base product controller index method.",
        success: true,
        totalRecords: Math.ceil(totalRecords / limit),
        currentPage: page,
        products: records,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
  create: async (req, res) => {
    try {
      if (!req.user?._id || !req.body) {
        return res.status(401).json({
          message: "No user or No data",
          success: false,
        });
      }

      const data = req.body;
      const userId = req.user._id;

      const normalized = normalizeData(data, userId);

      const newBaseProduct = createBaseProduct(normalized);

      return res.status(200).json({
        message: "Product created successfully.",
        product: newBaseProduct,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
};
