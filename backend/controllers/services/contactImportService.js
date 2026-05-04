const Contact = require("../../models/contact/Contact");
const { normalizeGoogleCsvContactRow } = require("../utils/contact/googleCsvContact");
const { normalizeKommoCsvContactRow } = require("../utils/contact/kommoCsvContact");

async function importContacts(rows = [], userId, orgId, normalizeRow) {
  const result = { created: 0, updated: 0, skipped: 0, failed: 0, errors: [] };

  for (const [index, row] of rows.entries()) {
    try {
      const contactData = normalizeRow(row, userId, orgId);
      if (!contactData.displayName && !contactData.emails.length && !contactData.phones.length) {
        result.skipped += 1;
        continue;
      }

      let existing = await Contact.findOne({
        organization: orgId,
        sourceType: contactData.sourceType,
        sourceRowHash: contactData.sourceRowHash,
      });

      if (!existing) {
        const fallback = [];
        if (contactData.emails.length) fallback.push({ emails: { $in: contactData.emails } });
        if (contactData.phones.length) fallback.push({ phones: { $in: contactData.phones } });

        if (fallback.length) {
          existing = await Contact.findOne({ organization: orgId, $or: fallback });
        }
      }

      if (existing) {
        await Contact.updateOne({ _id: existing._id }, { $set: contactData });
        result.updated += 1;
      } else {
        await Contact.create(contactData);
        result.created += 1;
      }
    } catch (error) {
      result.failed += 1;
      result.errors.push({ row: index + 1, message: error.message });
    }
  }

  return result;
}

async function importGoogleCsvContacts(rows = [], userId, orgId) {
  return importContacts(rows, userId, orgId, normalizeGoogleCsvContactRow);
}

async function importKommoCsvContacts(rows = [], userId, orgId) {
  return importContacts(rows, userId, orgId, normalizeKommoCsvContactRow);
}

module.exports = { importGoogleCsvContacts, importKommoCsvContacts };
