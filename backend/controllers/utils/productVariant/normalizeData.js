const { transliterate } = require("transliteration");
const { create } = require("../../../models/masterProduct/MasterProduct");

function normalizeData(data, userId) {
  if (!data || typeof data !== "object") throw new Error("Invalid data");

  const cleanString = (str) =>
    typeof str === "string" ? str.trim() : "";

  const normalizePrice = (price) => {
    if (!price || typeof price !== "object") return { value: 0, currency: "EUR" };
    return {
      value: Number(price.value) || 0,
      currency: typeof price.currency === "string" ? price.currency : "EUR",
    };
  };

  // Temel alanlar
  const title = cleanString(data.title);
  const make = cleanString(data.make);
  const model = cleanString(data.model);
  const description = cleanString(data.description);

  return {
    masterProduct: data.masterProduct || null,
    title,
    nTitle: transliterate(title.toLowerCase()),
    description,
    nDescription: transliterate(description.toLowerCase()),
    make,
    nMake: transliterate(make.toLowerCase()),
    model,
    nModel: transliterate(model.toLowerCase()),
    year: cleanString(data.year),
    condition: cleanString(data.condition),
    priceNet: normalizePrice(data.priceNet),
    priceList: normalizePrice(data.priceList),

    productVariant:
      ["asItIs", "configurable", "both"].includes(data.variantType)
        ? data.variantType
        : "asItIs",

    options: Array.isArray(data.options) ? data.options : [],
    createdFromMaster: data.createdFromMaster,

    user: userId,
  };
}

module.exports = normalizeData;
