const BaseProduct = require("../../../models/baseProduct/BaseProduct");
const createBaseProduct = async (data) => {
  try {
    return await BaseProduct.create({
      ...data,
    });
  } catch (error) {
    console.error("Error creating base product:", error);
    throw new Error("Failed to create base product");
  }
};

module.exports = createBaseProduct;
