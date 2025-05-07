const mongoose = require("mongoose");
const contactSchema = require("./contact.schema");
const applyValidators = require("./contact.validators");
const applyIndexes = require("./contact.indexes");
const applyStatics = require("./contact.statics");

applyValidators(contactSchema);
applyIndexes(contactSchema);
applyStatics(contactSchema);

module.exports = mongoose.model("Contact", contactSchema);
