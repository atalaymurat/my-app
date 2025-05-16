module.exports = {
  index: async (req, res) => {
    try {
      console.log("Base product controller index method called.");
      return res.status(200).json({
        message: "Base product controller index method.",
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
  create: async (req, res) => {
    try {
      console.log("Creating a new product with data:", req.body);
      return res.status(200).json({
        message: "Product created successfully.",
        product: [],
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
};
