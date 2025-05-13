const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const baseProductSchema = new Schema(
  {
    title: String,
    normalizedTitle: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    description: String,
  },
  { timestamps: true },
);

const BaseProduct = mongoose.model("BaseProduct", baseProductSchema);
module.exports = BaseProduct;
