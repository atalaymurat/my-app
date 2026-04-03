const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "none"], default: "none" },
    phones: [String],
    emails: [String],
    image: String,
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

contactSchema.index({ user: 1 });

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
