const mongoose = require("mongoose");
const addressSchema = require("./AddressSchema");

const Schema = mongoose.Schema;



const userCompanySchema = new Schema({
  user:    { type: Schema.Types.ObjectId, ref: "User", required: true },
  company: { type: Schema.Types.ObjectId, ref: "Company", required: true },

  customTitle: String,
  notes: String,
  userDomains: [String], // user company specific domains for the user
  userEmails: [String],
  userPhones: [String],
  userVatTitle: String, // user company specific vatTitle for the user
  userVd: String, // user company specific vd (tax office) for the user
  userTcNo: String, // user company specific tcNo for the user
  userVatNo: String, // user company specific vatNo for the user 
  addresses: [addressSchema],
  tags: [String],

  itemCode: String, // can be customized per user if needed
}, { timestamps: true });

userCompanySchema.index({ user: 1, company: 1 }, { unique: true });

const UserCompany = mongoose.model("UserCompany", userCompanySchema);
module.exports = UserCompany;
