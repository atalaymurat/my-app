const createNewCompany = require("../utils/company/createNewCompany");


const handleCompanyCreate = async (normalizedData) => {
  return await createNewCompany(normalizedData);
};

module.exports = {
  handleCompanyCreate,
};