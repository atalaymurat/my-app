const Make = require("../models/Make");

module.exports = {
  index: async (req, res) => {
    try {
      const records = await Make.find();

      return res.status(200).json({
        message: "Make controller list all makes",
        success: true,
        makes: records,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
  create: async (req, res) => {
    try {
      const data = req.body;

      const newMake = await Make.create(data);

      return res.status(200).json({
        message: "Product created successfully.",
        make: newMake,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
};
