const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const masterProductSchema = new Schema(
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
    productVariant: {
      type: String,
      enum: ["asItIs", "configurable", "both"],
      default: "asItIs",
    },
    visibilityScope: {
      type: String,
      enum: ["adminOnly", "group", "public", "custom"],
      default: "group",
    },
    customAccess: {
      viewableBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
      editableBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
  },
  { timestamps: true },
);

const MasterProduct = mongoose.model("MasterProduct", masterProductSchema);
module.exports = MasterProduct;
