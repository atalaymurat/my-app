const {
  getFieldUpdates,
  mergeArrays,
  mergeObjectArrays,
} = require("./helperFunctions");
const UserCompany = require("../../models/company/UserCompany");

const updateUserCompany = async (user, company, userData) => {
  const userCompany = await UserCompany.findOne({
    user: user._id,
    company: company._id,
  });
  if (!userCompany) return;

  const updates = {};
  const updateLogs = [];

  const arrayFields = ["userEmails", "userPhones", "tags", "userDomains"];
  const stringFields = [
    "customTitle",
    "notes",
    "userVatTitle",
    "userVd",
    "userTcNo",
    "userVatNo",
  ];

  arrayFields.forEach((field) => {
    if (field in userData) {
      const current = userCompany[field] || [];
      const merged = mergeArrays(current, userData[field]);
      if (merged !== null) {
        updates[field] = merged;
        updateLogs.push({
          field,
          previous: current,
          updated: merged,
        });
      }
    }
  });

  if ("addresses" in userData) {
    const current = userCompany.addresses || [];
    const merged = mergeObjectArrays(current, userData.addresses, [
      "normalizedLine1",
      "normalizedLine2",
      "normalizedCity",
      "normalizedDistrict",
      "normalizedCountry",
    ]);
    if (merged !== null) {
      updates.addresses = merged;
      updateLogs.push({
        field: "addresses",
        previous: current,
        updated: merged,
      });
    }
  }

  stringFields.forEach((field) => {
    if (field in userData) {
      const current = userCompany[field];
      const updated = getFieldUpdates(current, userData[field]);
      if (updated !== null) {
        updates[field] = updated;
        updateLogs.push({
          field,
          previous: current,
          updated,
        });
      }
    }
  });

  if (Object.keys(updates).length > 0) {
    await userCompany.updateOne({ $set: updates });

    console.log(`📝 [UserCompany Update Log] UserCompany ID: ${userCompany._id}`);
    for (const log of updateLogs) {
      console.log(
        `→ ${log.field} updated\n   - Previous: ${JSON.stringify(log.previous, null, 2)}\n   - New:      ${JSON.stringify(log.updated, null, 2)}`
      );
    }
  }

  return userCompany;
};

module.exports = updateUserCompany;
