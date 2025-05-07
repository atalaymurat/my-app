const { Company } = require("../../models/company/Company");

const createNewCompany = async (normalizedData, rawData) => {
  console.log("Step 1 Creating New Company:", normalizedData.title);
  return await Company.create({
    title: normalizedData.title,
    vatTitle: rawData.vatTitle, // full title for vat
    phones: normalizedData.phones,
    emails: normalizedData.emails,
    domains: normalizedData.domains,
    vd: rawData.vd,
    vatNo: normalizedData.vatNo,
    tcNo: normalizedData.tcNo,
    addresses: normalizedData.addresses,
    ogImage: rawData.ogImage || "",
    favicon: rawData.favicon || "",
    description: rawData.description || "",
  });
};

module.exports = createNewCompany;