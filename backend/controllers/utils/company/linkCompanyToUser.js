const UserCompany = require("../../../models/company/UserCompany");
// check if userCompany exists and if not create a new one
// userCompany check if it exists and if not create a new one
const linkCompanyToUser = async (user, company, userData) => {
  const userCompany = await UserCompany.findOne({
    user: user._id,
    company: company._id,
  });
  // Removed Logic function to controller updateUserCompany from here
  if (!userCompany) {
    await UserCompany.create({
      user: user._id,
      company: company._id,
      customTitle: userData.title,
      notes: "",
      userEmails: userData.emails,
      userPhones: userData.phones,
      addresses: userData.addresses,
      userVatTitle: userData.vatTitle,
      userVd: userData.vd,
      userTcNo: userData.tcNo,
      userVatNo: userData.vatNo,
      tags: [],
      userDomains: userData.domains,
    });
  }
};

module.exports = linkCompanyToUser;
