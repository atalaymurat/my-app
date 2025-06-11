const Configuration = require("../models/configuration/Configuration");
const normalizeData = require("./utils/configuration/normalizeData");

module.exports = {
  index: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const filter = { user: req.user._id };

      const totalRecords = await Configuration.countDocuments(filter);
      const records = await Configuration.find(filter)
        .populate([{ path: "baseProduct" }, { path: "options" }])
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      return res.status(200).json({
        message: "Option controller index method.",
        success: true,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
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

      const newConfiguration = new Configuration({
        ...normalizedData,
      });

      await newConfiguration.save();

      return res.status(200).json({
        message: "Configuration created successfully.",
        configuration: newConfiguration,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
};
