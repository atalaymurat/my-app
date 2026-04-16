const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const optionsSchema = new Schema(
  {
    title: String,
    nTitle: String,
    image: String,
    make: { type: Schema.Types.ObjectId, ref: "Make" },
    description: String,
    priceNet: Number,
    priceList: Number,
    priceOffer: Number,
    currency: String,
    isSample: { type: Boolean, default: false, index: true },
    createdBy: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true },
);

const Option = mongoose.model("Option", optionsSchema);
module.exports = Option;
