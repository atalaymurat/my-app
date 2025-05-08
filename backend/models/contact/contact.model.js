const mongoose = require("mongoose");
const contactSchema = require("./contact.schema");


const Contact = mongoose.model("Contact", contactSchema);
module.exports = { Contact } ; // <- exports an object, not the model directly