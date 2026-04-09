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

    totalsByCurrency: {
      type: Map,
      of: new Schema({
        priceListTotal:  Number,
        priceOfferTotal: Number,
        priceNetTotal:   Number,
        priceVat:        Number,
        priceGrandTotal: Number,
      }, { _id: false }),
    },
    vatRate:    { type: Number, default: 0.2 },
    showTotals: Boolean,
    showVat:    Boolean,
    createdAt:  { type: Date, default: Date.now },
  },
  { _id: false },
);

const DOC_TYPE_ENUM = ["Teklif", "Proforma", "Fatura", "Sipariş", "Sözleşme"];

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
    currentDocType: { type: String, enum: DOC_TYPE_ENUM, default: "Teklif", index: true },
    originDocType:  { type: String, enum: DOC_TYPE_ENUM, default: "Teklif" },
    status:         { type: String, enum: ["open", "won", "lost", "cancelled"], default: "open", index: true },
    isSample: { type: Boolean, default: false, index: true },
    convertedAt:    Date,
    closedAt:       Date,
  },
  { timestamps: true },
);

offerSchema.pre("save", function (next) {
  if (this.isModified("versions") && this.versions.length > 0) {
    this.currentDocType = this.versions[this.versions.length - 1].docType;
    if (this.isNew) {
      this.originDocType = this.versions[0].docType;
    }
  }
  next();
});

offerSchema.index({ "versions.docCode": 1 });
offerSchema.index({ organization: 1, originDocType: 1, createdAt: -1 });
offerSchema.index({ organization: 1, status: 1, currentDocType: 1 });

const Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer;
