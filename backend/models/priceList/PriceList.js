const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const priceListSchema = new Schema(
  {
    title: { type: String, required: true },
    nTitle: String, // normalized

    make: {
      type: Schema.Types.ObjectId,
      ref: "Make",
      required: true,
    },

    currency: { type: String, required: true },
    currentVersion: { type: Number, default: 0 },
    totalVersions: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },

    description: String,

    accessScope: {
      type: String,
      enum: ["all", "selected"],
      default: "selected",
    },

    assignedOrganizations: [{ type: Schema.Types.ObjectId, index: true }],

    isSample: { type: Boolean, default: false, index: true },
    organization: { type: Schema.Types.ObjectId, required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

// Basit normalize alanlari otomatik doldur.
priceListSchema.pre("validate", function normalizePriceList(next) {
  this.nTitle = this.title ? this.title.toLowerCase() : undefined;
  next();
});

priceListSchema.index({ organization: 1, make: 1, title: 1 }, { unique: true });
priceListSchema.index({ organization: 1, status: 1 });

module.exports = mongoose.model("PriceList", priceListSchema);
