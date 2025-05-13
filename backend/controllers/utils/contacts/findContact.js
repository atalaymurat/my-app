const { Contact } = require("../../../models/contact/contact.model");

const findContact = async (emails) => {
  console.log("Email FIND ONE", emails);
  if (emails?.length > 0) {
    const byEmail = await Contact.findOne({ emails: { $in: emails } });
    if (byEmail) {
      console.log(
        `🔍 [Contact Match] Found by Email(s) [${emails.join(", ")}]: Contact ID ${byEmail._id}`,
      );
    }
    return byEmail;
  }
  console.log(`❌ [Contact Match] No existing contact found`);
  return null;
};

module.exports = findContact;
