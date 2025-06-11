const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const baseProductSchema = new Schema(
  {
    title: String,
    nTitle: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    description: String,
    nDescription: String,
    make: String,
    nMake: String,
    model: String,
    nModel: String,
    year: String,
    condition: String,
    priceNet: { value: Number, currency: String },
    priceList: { value: Number, currency: String },
  },
  { timestamps: true },
);

const BaseProduct = mongoose.model("BaseProduct", baseProductSchema);
module.exports = BaseProduct;
