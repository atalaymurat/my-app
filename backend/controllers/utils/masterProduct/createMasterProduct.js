const MasterProduct = require("../../../models/masterProduct/MasterProduct");
const createMasterProduct = async (data) => {
  try {
    return await MasterProduct.create({
      ...data,
    });
  } catch (error) {
    console.error("Error creating master product:", error);
    throw new Error("Failed to create master product");
  }
};

module.exports = createMasterProduct;
