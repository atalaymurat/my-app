const Option = require("../models/options/Option");
const normalizeData = require("./utils/options/normalizeData");
const createOption = require("./utils/options/createOption");

module.exports = {
  index: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const filter = { user: req.user._id };

      const totalRecords = await Option.countDocuments(filter);
      const records = await Option.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      return res.status(200).json({
        message: "Option controller index method.",
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
      if (!req.user?._id || !req.body) {
        return res.status(401).json({
          message: "No user or No data",
          success: false,
        });
      }

      const data = req.body;
      const userId = req.user._id;

      const normalized = normalizeData(data, userId);

      const newOption = createOption(normalized);

      return res.status(200).json({
        message: "Product created successfully.",
        option: newOption,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
  list: async (req, res) => {
    try {
      const baseProductId = req.params.id;
      console.log("Base Product ID:", baseProductId);
      const records = await Option.find({
        user: req.user._id,
        baseProducts: { $in: [baseProductId] },
      });
      const list = records.map((record) => ({
        value: record._id,
        label: record.title,
        listPrice: record.priceList?.value,
        currency: record.priceList?.currency,
        desc: record.description, 
      }));
      res.status(200).json({
        message: "Option list retrieved successfully.",
        success: true,
        list,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
};
