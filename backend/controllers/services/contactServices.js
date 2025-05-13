const findContact = require("../utils/contacts/findContact");
const updateContact = require("../utils/contacts/updateContact");
const createContact = require("../utils/contacts/createContact");
const linkContact = require("../utils/contacts/linkContact");
const UserContact = require("../../models/contact/userContact");
const updateUserContact = require("../utils/contacts/updateUserContact");

const handleContactCreateOrUpdate = async (data) => {
  let contact = await findContact(data.emails || []);

  contact = contact
    ? await updateContact(contact, data)
    : await createContact(data);
  return contact;
};

const handleUserContactCreateOrUpdateLink = async (user, contact, data) => {
  const userContact = await UserContact.findOne({
    user: user._id,
    contact: contact._id,
  });
  if (!userContact) {
    return await linkContact(user, contact, data);
  }
  if (userContact) {
    return await updateUserContact(user, userContact, data);
  }
};

module.exports = {
  handleContactCreateOrUpdate,
  handleUserContactCreateOrUpdateLink,
};
