const Make = require("../models/Make");

module.exports = {
  index: async (req, res) => {
    try {
      const records = await Make.find(req.orgFilter);
      return res.status(200).json({ success: true, makes: records });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  create: async (req, res) => {
    try {
      const newMake = await Make.create({
        ...req.body,
        organization: req.user.orgId,
        createdBy: req.user._id,
      });
      return res.status(200).json({ success: true, make: newMake });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
};
