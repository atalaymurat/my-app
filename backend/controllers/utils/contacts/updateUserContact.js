const UserContact = require("../../../models/contact/userContact");

const updateUserContact = async (user, userContact, data) => {
  // UpdateUserContact and updateCompany diffrence here is this
  // updating userContact directly with form data not checking existing fields
  const res = await UserContact.findOneAndUpdate(
    {
      _id: userContact._id,
      user: user._id,
    
    },
    {
      uName: data.name,
      uGender: data.gender,
      uEmails: data.emails,
      uPhones: data.formattedPhones,
      uImage: data.image,
      uCompany: data.company,
      user: user._id,
      contact: data.contact,
    },
    {
      new: true,
    } 
  );
  return res;
};

module.exports = updateUserContact;
