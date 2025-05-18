const { transliterate } = require("transliteration");

function normalizeData(data, userId) {
  const normalized = {
    title:
      data.make?.trim()?.toLowerCase() +
      " " +
      data.model?.trim()?.toLowerCase(),
    nTitle: transliterate(
      data.make?.trim()?.toLowerCase() +
        " " +
        data.model?.trim()?.toLowerCase(),
    ),
    description: data.description
      ? transliterate(data.description.toLowerCase().trim())
      : "",
    nDescription: data.description?.trim()?.toLowerCase() || "",
    make: data.make?.trim()?.toLowerCase() || "",
    nMake: data.make ? transliterate(data.make.toLowerCase().trim()) : "",
    model: data.model?.trim()?.toLowerCase() || "",
    nModel: data.model ? transliterate(data.model.toLowerCase().trim()) : "",
    year: data.year?.trim() || "",
    condition: data.condition,
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
