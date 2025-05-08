const { Contact } = require("../../../models/contact/contact.model");

const createContact = async (normalizedData) => {
  return await Contact.create({
    ...normalizedData,
  });
};

module.exports = createContact;
