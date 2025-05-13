const UserContact = require("../../../models/contact/userContact");

const linkContact = async (user, contact, data) => {
  const userContact = await UserContact.findOne({
    user: user._id,
    contact: contact._id,
  });
  if (!userContact) {
    const res = await UserContact.create({
      uName: data.name,
      uGender: data.gender,
      uEmails: data.emails,
      uPhones: data.formattedPhones,
      uImage: data.image,
      uCompany: data.company,
      user: user._id,
      contact: contact._id,
    });

    console.log("User Contact Created", res);
  }

  return userContact;
};

module.exports = linkContact;
