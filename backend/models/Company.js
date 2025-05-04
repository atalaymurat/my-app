const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySchema = new Schema({
  title: String,
  normalizedTitle: String,
  vatTitle: String,
  normalizedVatTitle: String,
  itemCode: String,
  phone: String,
  email: String,
  vd: String,
  vatNo: String,
  tcNo: String,
  web: String,
  addresses: [
    {
      title: String,
      line1: String,
      normalizedLine1: String,
      line2: String,
      normalizedLine2: String,
      district: String,
      normalizedDistrict: String,
      city: String,
      normalizedCity: String,
      country: String,
      normalizedCountry: String,
      zip: String,
      raw: String,
    },
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ogImage: String,
  favicon: String,
  description: String,
});
companySchema.set("timestamps", true);

// Add the findOrCreate static method
companySchema.statics.findOrCreate = async function (data) {
  try {
    // Build query with only non-empty fields
    const queryConditions = [];

    if (data.vatNo && data.vatNo.trim() !== "") {
      queryConditions.push({ vatNo: data.vatNo });
    }

    if (data.tcNo && data.tcNo.trim() !== "") {
      queryConditions.push({ tcNo: data.tcNo });
    }

    if (data.email && data.email.trim() !== "") {
      queryConditions.push({ email: data.email });
    }

    if (data.web && data.web.trim() !== "") {
      queryConditions.push({ web: data.web });
    }

    // Only search if we have valid conditions
    let company = null;
    if (queryConditions.length > 0) {
      company = await this.findOne({
        $or: queryConditions,
      });
    }

    // If company doesn't exist, create new company
    if (!company) {
      company = await this.create({
        ...data,
      });
     return company
    }

    return null;
  } catch (error) {
    console.error("Company.findOrCreate error:", error);
    throw error;
  }
};

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
