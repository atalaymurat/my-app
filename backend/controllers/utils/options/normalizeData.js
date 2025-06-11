const { transliterate } = require("transliteration");

function normalizeData(data, userId) {
  const normalized = {
    title: data.title?.trim() || "",
    nTitle: transliterate(data.title.trim()?.toLowerCase()),
    baseProducts: data.baseProducts.filter(item => item !== ""),
    image: data.image?.trim() || "",
    description: data.description
      ? transliterate(data.description.toLowerCase().trim())
      : "",
    nDescription: data.description?.trim()?.toLowerCase() || "",
    priceNet: {
      value: data.priceNet?.value?.trim(),
      currency: data.priceNet?.currency,
    },
    priceList: {
      value: data.priceList?.value?.trim(),
      currency: data.priceList?.currency,
    },
    user: userId,
  };

  return normalized;
}

module.exports = normalizeData;
