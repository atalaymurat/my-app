const mongoose = require("mongoose");
const { Schema } = mongoose;
const { transliterate } = require("transliteration");

const addressSchema = new Schema(
  {
    title: { type: String }, // Örn: Fatura Adresi, Teslimat Adresi
    line1: { type: String },
    normalizedLine1: { type: String },
    line2: { type: String },
    normalizedLine2: { type: String },
    district: { type: String },
    normalizedDistrict: { type: String },
    city: { type: String },
    normalizedCity: { type: String },
    country: { type: String },
    normalizedCountry: { type: String },
    zip: { type: String },
    raw: { type: String }, // Kullanıcıdan gelen adresin ham hali
  },
  { _id: false }
);

// Pre-save hook ile normalize işlemleri ekleyelim
addressSchema.pre("save", function (next) {
  if (this.city) {
    this.normalizedCity = transliterate(this.city.toLowerCase());
  }
  if (this.district) {
    this.normalizedDistrict = transliterate(this.district.toLowerCase());
  }
  if (this.country) {
    this.normalizedCountry = transliterate(this.country.toLowerCase());
  }
  if (this.line1) {
    this.normalizedLine1 = transliterate(this.line1.toLowerCase());
  }
  if (this.line2) {
    this.normalizedLine2 = transliterate(this.line2.toLowerCase());
  }
  next();
});

module.exports = addressSchema;
