const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* -------------------------------
   LineItem Schema
--------------------------------*/
const lineItemSchema = new Schema(
  {
    productValue: String, // base veya conf ürünün id'si + prefix
    title: String,
    priceList: Number,
    currencyList: String,
    currencyNet: String,
    type: { type: String, enum: ["base", "configuration"] },
    desc: String,
    options: [String], // opsiyonların başlıkları
    priceNet: Number,
    notes: String,
  },
  { _id: false },
); // _id olmadan gömülü doküman olarak tutulacak

/* -------------------------------
   Offer Version Schema
--------------------------------*/
const offerVersionSchema = new Schema(
  {
    version: { type: Number, required: true },
    docDate: { type: Date, default: Date.now },
    validDate: Date,

    paymentTerms: String,
    deliveryTerms: String,
    warranty: String,

    lineItems: [lineItemSchema],

    priceNetTotal: { value: Number, currency: String },
    priceListTotal: { value: Number, currency: String },
    priceVat: { value: Number, currency: String },
    priceDiscount: { value: Number, currency: String },
    priceGrandTotal: { value: Number, currency: String },

    showTotals: Boolean,
    showVat: Boolean,

    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

/* -------------------------------
   Offer Schema
--------------------------------*/
const offerSchema = new Schema(
  {
    docCode: { type: String, required: true, index: true },
    docType: {
      type: String,
      enum: ["Teklif", "Proforma", "Fatura", "Siparis"],
      required: true,
    }, // BURADA

    company: { type: Schema.Types.ObjectId, ref: "UserCompany", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    versions: {
      type: [offerVersionSchema],
      validate: [arrayLimit, "{PATH} exceeds the limit of 20 versions"],
    },
  },
  { timestamps: true },
);

// Versiyon sayısı kontrolü için helper fonksiyon
function arrayLimit(val) {
  return val.length <= 20; // maksimum 20 versiyon
}

const Offer = mongoose.model("Offer", offerSchema);

module.exports = Offer;
