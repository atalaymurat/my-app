const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const snapshotOptionSchema = new Schema(
  {
    sourceOption: { type: Schema.Types.ObjectId, ref: "Option" },
    title: String,
    nTitle: String,
    image: String,
    description: String,
    priceNet: Number,
    priceList: Number,
    priceOffer: Number,
    currency: String,
  },
  { _id: false }
);

const snapshotVariantSchema = new Schema(
  {
    sourceVariantId: String,
    modelType: { type: String, required: true }, // 2128 Basic
    code: String,
    priceNet: Number,
    priceOffer: Number,
    priceList: Number,
    desc: String,
    image: String,
    stock: Number,
    technicalSpecs: [
      {
        key: String,
        value: String,
      },
    ],
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const snapshotItemSchema = new Schema(
  {
    sourceMasterProduct: {
      type: Schema.Types.ObjectId,
      ref: "MasterProduct",
    },
    title: { type: String, required: true },
    nTitle: String,
    caption: String,
    image: String,
    desc: String,
    model: String,
    currency: String,
    variants: [snapshotVariantSchema],
    options: [snapshotOptionSchema],
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const priceListSnapshotSchema = new Schema(
  {
    priceList: {
      type: Schema.Types.ObjectId,
      ref: "PriceList",
      required: true,
      index: true,
    },
    version: { type: Number, required: true },

    status: {
      type: String,
      enum: ["draft", "published", "superseded"],
      default: "draft",
      index: true,
    },

    publishedAt: Date,
    validFrom: Date,
    validUntil: Date,
    notes: String, // Or: 2026 Q2 fiyat guncellemesi

    items: [snapshotItemSchema],

    summary: {
      totalProducts: { type: Number, default: 0 },
      totalVariants: { type: Number, default: 0 },
      totalOptions: { type: Number, default: 0 },
    },

    createdBy: { type: Schema.Types.ObjectId, required: true },
    organization: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

// Snapshot icinde normalize alanlari tutarli kalir.
priceListSnapshotSchema.pre("validate", function normalizeSnapshot(next) {
  if (Array.isArray(this.items)) {
    this.items.forEach((item) => {
      item.nTitle = item.title ? item.title.toLowerCase() : undefined;

      if (Array.isArray(item.options)) {
        item.options.forEach((option) => {
          option.nTitle = option.title ? option.title.toLowerCase() : undefined;
        });
      }
    });
  }

  next();
});

priceListSnapshotSchema.index({ priceList: 1, version: 1 }, { unique: true });
priceListSnapshotSchema.index({ priceList: 1, status: 1 });

module.exports = mongoose.model("PriceListSnapshot", priceListSnapshotSchema);
