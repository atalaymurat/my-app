const { transliterate } = require("transliteration");

const normalizeAddress = (address) => {
  return {
    ...address,
    normalizedLine1: address.line1
      ? transliterate(address.line1.toLowerCase())
      : "",
    normalizedLine2: address.line2
      ? transliterate(address.line2.toLowerCase())
      : "",
    normalizedCity: address.city
      ? transliterate(address.city.toLowerCase())
      : "",
    normalizedDistrict: address.district
      ? transliterate(address.district.toLowerCase())
      : "",
    normalizedCountry: address.country
      ? transliterate(address.country.toLowerCase())
      : "",
  };
};

module.exports = normalizeAddress;
