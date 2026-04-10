const MasterProduct = require("../../../models/masterProduct/MasterProduct");
const logger = require("../../../config/logger");

const createMasterProduct = async (data) => {
  try {
    return await MasterProduct.create({ ...data });
  } catch (error) {
    logger.error({ message: "Error creating master product", error: error.message });
    throw new Error("Failed to create master product");
  }
};

module.exports = createMasterProduct;
