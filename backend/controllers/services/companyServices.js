const normalizeCompanyData = require("../utils/company/normalizeCompanyData");
const findExistingCompany = require("../utils/company/findExistingCompany");
const createNewCompany = require("../utils/company/createNewCompany");
const updateCompany = require("../utils/company/updateCompany");
const linkCompanyToUser = require("../utils/company/linkCompanyToUser");
const updateUserCompany = require("../utils/company/updateUserCompany");

const handleCompanyCreateOrUpdate = async (normalizedData, rawData) => {
  let company = await findExistingCompany(
    normalizedData.vatNo,
    normalizedData.domains
  );

  company && console.log("Step 1 Find Existing Company :", company.title);

  company = company
    ? await updateCompany(company, normalizedData, rawData)
    : await createNewCompany(normalizedData, rawData);

  return company;
};

const linkCompany = async (user, company, normalizedData) => {
  await linkCompanyToUser(user, company, {
    title: normalizedData.title,
    emails: normalizedData.emails,
    phones: normalizedData.phones,
    addresses: normalizedData.addresses,
    tags: normalizedData.tags,
    notes: normalizedData.notes,
    vatTitle: normalizedData.vatTitle,
    vd: normalizedData.vd,
    tcNo: normalizedData.tcNo,
    vatNo: normalizedData.vatNo,
    domains: normalizedData.domains,
  });
};

const updateUserCompanyLink = async (user, company, normalizedData) => {
  await updateUserCompany(user, company, {
    customTitle: normalizedData.title,
    userEmails: normalizedData.emails,
    userPhones: normalizedData.phones,
    addresses: normalizedData.addresses,
    tags: normalizedData.tags,
    notes: normalizedData.notes,
    userVatTitle: normalizedData.vatTitle,
    userVd: normalizedData.vd,
    userTcNo: normalizedData.tcNo,
    userVatNo: normalizedData.vatNo,
    userDomains: normalizedData.domains,
  });
};

module.exports = {
  normalizeCompanyData,
  handleCompanyCreateOrUpdate,
  linkCompany,
  updateUserCompanyLink,
};