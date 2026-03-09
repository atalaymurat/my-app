const { transliterate } = require("transliteration");

function normalizeData(data, userId) {
  const normalized = {
    title: data.model?.trim()?.toLowerCase(),
    nTitle: transliterate(data.model?.trim()?.toLowerCase()),
    description: data.description,
    nDescription: data.description?.trim()?.toLowerCase() || "",
    make: data.make,
    model: data.model?.trim()?.toLowerCase() || "",
    nModel: data.model ? transliterate(data.model.toLowerCase().trim()) : "",
    user: userId,
    options: data.options,
    variants: data.variants,
    caption: transliterate(data.caption),
    currency: data.currency,
    condition: data.condition,
    year: data.year,

  };

  return normalized;
}

module.exports = normalizeData;
