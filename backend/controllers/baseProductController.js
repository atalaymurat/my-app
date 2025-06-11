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
        totalPages: Math.ceil(totalRecords / limit),
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
  list: async (req, res) => {
    try {
      const make = req.query.make;
      const query = { user: req.user._id, condition: "new" };

      if (make) {
        query.nMake = make;
      }

      const records = await BaseProduct.find(query);

      const list = records.map((record) => ({
        value: record._id,
        label: record.title,
        listPrice: record.priceList?.value,
        currency: record.priceList?.currency,
        desc: record.description,
      }));

      res.status(200).json({
        message: make
          ? `Base product list filtered by make '${make}' retrieved successfully.`
          : "Base product list retrieved successfully.",
        success: true,
        list,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
  makeList: async (req, res) => {
    try {
      const records = await BaseProduct.find({ user: req.user._id, condition: "new" });
      const list = [...new Set(records.map((record) => record.make))];
      const makes = list.map((make) => ({
        value: make,
        label: make,
      }));

      res.status(200).json({
        message: "Base product makes retrieved successfully.",
        success: true,
        makes,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
};
