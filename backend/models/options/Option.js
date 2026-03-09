const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const optionsSchema = new Schema(
  {
    title: String,
    nTitle: String,
    image: String,
    masterProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "MasterProduct",
      },
    ],
    make: { type: Schema.Types.ObjectId, ref: "Make" },
    description: String,
    priceNet: Number,
    priceList: Number,
    priceOffer: Number,
    currency: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Option = mongoose.model("Option", optionsSchema);
module.exports = Option;
