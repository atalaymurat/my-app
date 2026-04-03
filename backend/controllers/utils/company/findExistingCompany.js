const Company = require("../../../models/company/Company");

const findExistingCompany = async (vatNo, domains) => {
  if (domains?.length > 0) {
    const byDomain = await Company.findOne({ domains: { $in: domains } });
    if (byDomain) return byDomain;
  }
  if (vatNo) {
    const byVatNo = await Company.findOne({ vatNo });
    if (byVatNo) return byVatNo;
  }
  return null;
};

module.exports = findExistingCompany;
