const ProductVariant = require("../models/productVariant/ProductVariant");
const normalizeData = require("./utils/productVariant/normalizeData");

module.exports = {
  index: async (req, res) => {
    try {
      const rawLimit = req.query.limit;
      const limit =
        rawLimit && (rawLimit === "all" || Number(rawLimit) === 0)
          ? 0
          : parseInt(rawLimit, 10) || 10;

      const page = parseInt(req.query.page, 10) || 1;
      const skip = limit === 0 ? 0 : (page - 1) * limit;

      const filter = { user: req.user._id };

      const totalRecords = await ProductVariant.countDocuments(filter);

      let query = ProductVariant.find(filter)
        .populate([{ path: "masterProduct" }, { path: "options" }])
        .sort({ createdAt: -1 });

      if (limit !== 0) {
        query = query.skip(skip).limit(limit);
      }

      const records = await query.exec();

      return res.status(200).json({
        message: "Option controller index method.",
        success: true,
        totalPages: limit === 0 ? 1 : Math.ceil(totalRecords / limit),
        currentPage: limit === 0 ? 1 : page,
        records,
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

      // Normalize the data
      const normalizedData = normalizeData(data, userId);

      const record = new ProductVariant({
        ...normalizedData,
      });

      await record.save();

      return res.status(200).json({
        message: "Configuration created successfully.",
        record,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
};
