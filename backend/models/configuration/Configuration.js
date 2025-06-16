const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const configurationSchema = new Schema(
  {
    title: String,
    nTitle: String,
    image: String,
    make: String,
    masterProduct: {
      type: Schema.Types.ObjectId,
      ref: "MasterProduct",
    },
    options: [
      {
        type: Schema.Types.ObjectId,
        ref: "Option",
      },
    ],
    description: String,
    priceNet: { value: Number, currency: String },
    priceList: { value: Number, currency: String },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Configuration = mongoose.model("Configuration", configurationSchema);
module.exports = Configuration;
