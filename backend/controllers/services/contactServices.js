const findContact = require("../utils/contacts/findContact");
const updateContact = require("../utils/contacts/updateContact");
const createContact = require("../utils/contacts/createContact");

const handleContactCreateOrUpdate = async (data) => {
  let contact = await findContact(data.emails || []);

  contact = contact ? await updateContact(contact, data) : await createContact(data);
  return contact;
};

module.exports = {
  handleContactCreateOrUpdate,
};
