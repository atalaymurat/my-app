module.exports = {
  index: async (req, res) => {
    try {
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
      return res.status(201).json({
        message: "Product created successfully.",
        product: newProduct,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
};
