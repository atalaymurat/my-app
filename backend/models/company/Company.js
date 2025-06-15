const mongoose = require("mongoose");
const addressSchema = require("./AddressSchema");
const formatDomain = require("../../controllers/utils/formatDomain"); // Assuming you have a helper function for formatting domains

const Schema = mongoose.Schema;

const companySchema = new Schema(
  {
    title: String,
    normalizedTitle: String,
    vatTitle: String,
    normalizedVatTitle: String,
    itemCode: String,

    phones: {
      type: [String],
    }, // Can store multiple numbers

    emails: [String], // Can store multiple emails
    domains: {
      type: [String],
      set: (value) => value.map((domain) => formatDomain(domain)), // Format domains
    }, // Can store multiple domains
    vd: String,
    vatNo: { type: String, unique: true, sparse: true },
    tcNo: { type: String, unique: true, sparse: true },
    addresses: [addressSchema],
    tags: [String],

    // Company specific fields
    ogImage: String,
    favicon: String,
    description: String,
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

const Company = mongoose.model("Company", companySchema);
module.exports = Company;
