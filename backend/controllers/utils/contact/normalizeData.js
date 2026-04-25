const { transliterate } = require("transliteration")

function normalizeText(value = "") {
  return transliterate(value)
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
}

function normalizeContactUpdateData(data = {}) {
  const updateData = {};

  if (data.name !== undefined) {
    updateData.name = data.name.trim();
    updateData.normalizedName = normalizeText(data.name);
  }

  if (data.gender !== undefined) {
    updateData.gender = data.gender || "none";
  }

  if (data.emails !== undefined) {
    updateData.emails = Array.isArray(data.emails)
      ? data.emails.map((e) => e.trim().toLowerCase()).filter(Boolean)
      : [];
  }

  if (data.formattedPhones !== undefined || data.phones !== undefined) {
    const phoneSource = data.formattedPhones || data.phones;

    updateData.phones = Array.isArray(phoneSource)
      ? phoneSource.filter(Boolean)
      : [];
  }

  if (data.company !== undefined) {
    updateData.company = data.company || undefined;
  }

  return updateData;
}

function normalizeContactData(data = {}, userId, orgId) {
  return {
    name: data.name?.trim() || "",
    normalizedName: normalizeText(data.name),

    gender: data.gender || "none",

    phones:
      data.formattedPhones?.filter(Boolean) ||
      data.phones?.filter(Boolean) ||
      [],

    emails: Array.isArray(data.emails)
      ? data.emails.map((e) => e.trim().toLowerCase()).filter(Boolean)
      : [],

    company: data.company || undefined,

    organization: orgId,
    createdBy: userId,
  }

}

module.exports = {
  normalizeText,
  normalizeContactData,
  normalizeContactUpdateData,
}
