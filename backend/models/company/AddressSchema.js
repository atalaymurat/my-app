const mongoose = require("mongoose");
const { Schema } = mongoose;

const addressSchema = new Schema(
  {
    title: { type: String },
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
    raw: { type: String },
  },
  { _id: false }
);

module.exports = addressSchema;
