const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const variantSchema = new Schema(
  {
    modelType: { type: String, required: true }, // 2128 Basic
    code: { type: String },
    priceNet: Number,
    priceOffer: Number,
    priceList: Number,
    desc: String,
    image: String,

    stock: { type: Number, default: 0 },
    technicalSpecs: [
      {
        key: String,
        value: String,
      },
    ],

    isDefault: { type: Boolean, default: false },
  },
  { _id: true },
);

const masterProductSchema = new Schema(
  {
    title: { type: String, required: true },
    nTitle: String,

    caption: String,
    nCaption: String,

    make: {
      type: Schema.Types.ObjectId,
      ref: "Make",
      required: true,
    },

    model: String,
    nModel: String,

    currency: String, // master ve opstion tek currency
    // ✅ ALT MODELLER
    variants: [variantSchema],

    visibilityScope: {
      type: String,
      enum: ["adminOnly", "group", "public", "custom"],
      default: "group",
    },

    customAccess: {
      viewableBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
      editableBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const MasterProduct = mongoose.model("MasterProduct", masterProductSchema);

module.exports = MasterProduct;
