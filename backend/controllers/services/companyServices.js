const normalizeCompanyData = require("../utils/company/normalizeCompanyData");
const findExistingCompany = require("../utils/company/findExistingCompany");
const createNewCompany = require("../utils/company/createNewCompany");
const updateCompany = require("../utils/company/updateCompany");

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


module.exports = {
  normalizeCompanyData,
  handleCompanyCreateOrUpdate,
};