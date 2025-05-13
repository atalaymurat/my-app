const mongoose = require("mongoose");

const userContactSchema = new mongoose.Schema({
  uGender: { type: String, enum: ["male", "female", "none"] },
  uName: { type: String, required: true },
  uEmails: [String],
  uPhones: [String],
  uImage: String,
  uCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contact",
  },
});


userContactSchema.index({ user: 1, uCompany: 1 });
const UserContact = mongoose.model("UserContact", userContactSchema);
module.exports = UserContact;
