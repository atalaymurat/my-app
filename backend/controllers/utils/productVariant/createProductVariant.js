const ProductVariant = require("../../../models/productVariant/ProductVariant");

async function createProductVariant(normalizedData, userId) {
  const variantData = {
    ...normalizedData,
    user: userId,
  };

  const variant = new ProductVariant(variantData);
  console.log("Creating product variant with data:", variant);
  return await variant.save();
}

module.exports = createProductVariant;