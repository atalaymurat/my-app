const  Company  = require("../../../models/company/Company");

const createNewCompany = async (normalizedData, rawData) => {
  console.log("Step 1 Creating New Company:", normalizedData.title);
  return await Company.create({
    title: normalizedData.title,
    vatTitle: normalizedData.vatTitle, // full title for vat
    phones: normalizedData.phones,
    emails: normalizedData.emails,
    domains: normalizedData.domains,
    vd: normalizedData.vd,
    vatNo: normalizedData.vatNo ,
    tcNo: normalizedData.tcNo,
    addresses: normalizedData.addresses,
    ogImage: rawData.ogImage || "",
    favicon: rawData.favicon || "",
    description: rawData.description || "",
    tags: rawData.tags || [],
    user: normalizedData.user, // Ensure userId is passed correctly
  });
};

module.exports = createNewCompany;
