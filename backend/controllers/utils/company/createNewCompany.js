const Company = require("../../../models/company/Company");

const createNewCompany = async (normalizedData) => {
  return await Company.create(normalizedData);
};

module.exports = createNewCompany;
