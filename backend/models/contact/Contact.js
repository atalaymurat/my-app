const mongoose = require("mongoose");

const CONTACT_SOURCE = ["manual", "google", "kommo"];
const CONTACT_SOURCE_TYPE = ["manual", "google_csv", "kommo_csv"];

const contactSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true },
    normalizedName: { type: String, index: true },
    givenName: String,
    middleName: String,
    familyName: String,
    gender: { type: String, enum: ["male", "female", "none"], default: "none" },
    phones: [String],
    emails: [String],
    googleLabels: [String],
    image: String,
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    source: { type: String, enum: CONTACT_SOURCE, default: "manual", index: true },
    sourceType: {
      type: String,
      enum: CONTACT_SOURCE_TYPE,
      default: "manual",
      index: true,
    },
    sourceRowHash: String,
    importedAt: Date,
    isSample: { type: Boolean, default: false, index: true },
    organization: { type: mongoose.Schema.Types.ObjectId, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true },
);

contactSchema.index({ organization: 1 });
contactSchema.index({ organization: 1, normalizedName: 1 });
contactSchema.index(
  { organization: 1, sourceType: 1, sourceRowHash: 1 },
  {
    unique: true,
    partialFilterExpression: { sourceRowHash: { $type: "string" } },
  },
);
contactSchema.index({ organization: 1, emails: 1 });
contactSchema.index({ organization: 1, phones: 1 });

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
