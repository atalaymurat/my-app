const { Company } = require("../../../models/company/Company");

const findExistingCompany = async (vatNo, domains) => {
  if (domains?.length > 0) {
    const byDomain = await Company.findOne({ domains: { $in: domains } });
    if (byDomain) {
      console.log(
        `🔍 [Company Match] Found by Domain(s) [${domains.join(
          ", "
        )}]: Company ID ${byDomain._id}`
      );
      return byDomain;
    }
  }
  if (vatNo) {
    const byVatNo = await Company.findOne({ vatNo });
    if (byVatNo) {
      console.log(
        `🔍 [Company Match] Found by VAT No (${vatNo}): Company ID ${byVatNo._id}`
      );
      return byVatNo;
    }
  }

  console.log(
    `❌ [Company Match] No existing company found with VAT No (${vatNo}) or domains [${
      domains?.join(", ") || "none"
    }]`
  );
  return null;
};

module.exports = findExistingCompany;
