const { transliterate } = require("transliteration");

function normalizeData(data, userId) {
  const normalized = {
    title: data.title?.trim() || "",
    nTitle: transliterate(data.title.trim()?.toLowerCase()),
    masterProducts: data.masterProducts.filter(item => item !== ""),
    image: data.image?.trim() || "",
    description: data.description
      ? transliterate(data.description.toLowerCase().trim())
      : "",
    nDescription: data.description?.trim()?.toLowerCase() || "",
    priceNet: data.priceNet,
    priceList: data.priceList,
    priceOffer: data.priceOffer,
    currency: data.currency,
    user: userId,
    make: data.make,
  };

  return normalized;
}

module.exports = normalizeData;
