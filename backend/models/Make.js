const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const makeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    nName: String, // normalized

    logo: String,
    country: String,
    description: String,

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Make", makeSchema);