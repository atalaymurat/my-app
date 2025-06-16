const { transliterate } = require("transliteration");

function normalizeData(data, userId) {
  const normalized = {
    title: data.title?.trim() || "",
    nTitle: transliterate(data.title.trim()?.toLowerCase()),
    masterProduct: data.masterProduct,
    options: data.options?.filter((item) => item !== "") || [],
    image: data.image?.trim() || "",
    description: data.description
      ? transliterate(data.description.toLowerCase().trim())
      : "",
    priceList: data.priceList,
    user: userId,
  };

  return normalized;
}

module.exports = normalizeData;
