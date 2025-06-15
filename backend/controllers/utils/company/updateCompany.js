const { mergeArrays, mergeObjectArrays, getFieldUpdates } = require("../helperFunctions");
const  Company  = require("../../../models/company/Company");

const updateCompany = async (company, normalizedData, rawData) => {
  const updates = {};
  const updateLogs = [];

  const fieldsToUpdate = [
    { field: "phones", value: normalizedData.phones, merge: true },
    { field: "emails", value: normalizedData.emails, merge: true },
    { field: "domains", value: normalizedData.domains, merge: true },
    {
      field: "addresses",
      value: normalizedData.addresses,
      merge: true,
      objectFields: [
        "normalizedLine1",
        "normalizedLine2",
        "normalizedLine2",
        "normalizedCity",
        "normalizedDistrict",
        "normalizedCountry",
      ],
    },
    { field: "ogImage", value: rawData.ogImage },
    { field: "favicon", value: rawData.favicon },
    { field: "description", value: rawData.description },
    { field: "vatNo", value: normalizedData.vatNo },
    { field: "tcNo", value: normalizedData.tcNo },
    { field: "vd", value: rawData.vd },
  ];

  for (const { field, value, merge, objectFields } of fieldsToUpdate) {
    if (merge) {
      const current = company[field] || [];

      const merged = objectFields
        ? mergeObjectArrays(current, value, objectFields)
        : mergeArrays(current, value);

      if (merged !== null) {
        updates[field] = merged;
        updateLogs.push({
          field,
          previous: current,
          updated: merged,
        });
      }
    } else {
      const current = company[field];
      const updated = getFieldUpdates(current, value);

      if (updated !== null) {
        updates[field] = updated;
        updateLogs.push({
          field,
          previous: current,
          updated: updated,
        });
      }
    }
  }

  if (Object.keys(updates).length > 0) {
    await Company.findByIdAndUpdate(company._id, { $set: updates });

    console.log(`📝 [Company Update Log] Company ID: ${company._id}`);
    for (const log of updateLogs) {
      console.log(
        `→ ${log.field} updated\n   - Previous: ${JSON.stringify(log.previous, null, 2)}\n   - New:      ${JSON.stringify(log.updated, null, 2)}`
      );
    }

    return await Company.findById(company._id);
  }

  return company;
};

module.exports = updateCompany;
