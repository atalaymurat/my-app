const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* -------------------------------
   LineItem Schema
--------------------------------*/
const lineItemSchema = new Schema(
  {
    productValue: String, // base veya conf ürünün id'si + prefix
    variantId: String,
    title: String,
    caption: String,
    priceList: Number,
    priceOffer: Number,
    priceNet: Number,
    currency: String,
    selectedOptions: [
      {
        optionId: String,
        title: String,
        label: String,
        quantity: Number,
        listPrice: Number,
        offerPrice: Number,
        netPrice: Number,
        currency: String,
        desc: String,
      },
    ],
    notes: String,
    condition: String,
    quantity: { type: Number, default: 1 },
    priceListTotal: { value: Number, currency: String },
    priceOfferTotal: { value: Number, currency: String },
    priceNetTotal: { value: Number, currency: String },
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

    priceListTotal: { value: Number, currency: String },
    priceOfferTotal: { value: Number, currency: String },
    priceNetTotal: { value: Number, currency: String },
    priceVat: { value: Number, currency: String },
    priceDiscount: { value: Number, currency: String },
    priceGrandTotal: { value: Number, currency: String },
    vatRate: { type: Number, default: 0.2 }, // varsayılan KDV oranı %20
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

    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    contact: { type: Schema.Types.ObjectId, ref: "Contact" },
    organization: { type: Schema.Types.ObjectId, required: true },
    createdBy: { type: Schema.Types.ObjectId, required: true },

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
