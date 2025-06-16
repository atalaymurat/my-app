const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productVariantSchema = new Schema({
  masterProduct: {
    type: Schema.Types.ObjectId,
    ref: "MasterProduct",
    required: true,
  },
  title: String,
  nTitle: String,
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

  productVariant: {
    type: String,
    enum: ["asItIs", "configurable", "both"],
    required: true,
  },

  options: [
    {
      type: Schema.Types.ObjectId,
      ref: "Option",
    },
  ],

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  createdFromMaster: {
    type: Boolean,
    default: true,
  },
},
{ timestamps: true });

const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);
module.exports = ProductVariant;