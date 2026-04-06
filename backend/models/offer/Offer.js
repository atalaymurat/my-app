const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const termSchema = require("../termSchema");

const lineItemSchema = new Schema(
  {
    productValue: String, variantId: String, title: String, caption: String,
    productDesc: String, variantDesc: String,
    image: String, priceList: Number, priceOffer: Number, priceNet: Number, currency: String,
    selectedOptions: [{
      optionId: String, title: String, label: String, quantity: Number,
      listPrice: Number, offerPrice: Number, netPrice: Number, currency: String, desc: String, image: String,
    }],
    notes: String, condition: String,
    quantity: { type: Number, default: 1 },
    priceListTotal: { value: Number, currency: String },
    priceOfferTotal: { value: Number, currency: String },
    priceNetTotal:   { value: Number, currency: String },
  },
  { _id: false },
);

const offerVersionSchema = new Schema(
  {
    version:  { type: Number, required: true },
    docCode:  { type: String, required: true },
    docType:  {
      type: String,
      enum: ["Teklif", "Proforma", "Fatura", "Sipariş", "Sözleşme"],
      required: true,
    },
    docDate:  { type: Date, default: Date.now },
    validDate: Date,

    offerTerms: [termSchema],
    lineItems:  [lineItemSchema],

    priceListTotal:  { value: Number, currency: String },
    priceOfferTotal: { value: Number, currency: String },
    priceNetTotal:   { value: Number, currency: String },
    priceVat:        { value: Number, currency: String },
    priceDiscount:   { value: Number, currency: String },
    priceGrandTotal: { value: Number, currency: String },
    vatRate:    { type: Number, default: 0.2 },
    showTotals: Boolean,
    showVat:    Boolean,
    createdAt:  { type: Date, default: Date.now },
  },
  { _id: false },
);

const offerSchema = new Schema(
  {
    company:      { type: Schema.Types.ObjectId, ref: "Company", required: true },
    contact:      { type: Schema.Types.ObjectId, ref: "Contact" },
    organization: { type: Schema.Types.ObjectId },
    createdBy:    { type: Schema.Types.ObjectId },
    versions: {
      type: [offerVersionSchema],
      validate: [v => v.length <= 20, "{PATH} exceeds the limit of 20 versions"],
    },
  },
  { timestamps: true },
);

offerSchema.index({ "versions.docCode": 1 });

const Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer;
