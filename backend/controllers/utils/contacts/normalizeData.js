const { transliterate } = require("transliteration");

function normalizePhone(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, ""); // Remove non-digits
  return digits.length >= 7 ? digits : null;
}

function normalizeData(data = {}, user) {
  const normalized = {
    gender: data.gender?.trim()?.toLowerCase() || "none",
    name: data.name ? transliterate(data.name.toLowerCase().trim()) : "",
    phones: Array.isArray(data.formattedPhones)
      ? [...new Set(data.formattedPhones.map((p) => normalizePhone(p)).filter(Boolean))]
      : [],

    emails: Array.isArray(data.emails)
      ? [...new Set(data.emails.map((e) => e.trim().toLowerCase()).filter(Boolean))]
      : [],
    image: data.image?.trim() || "",
    createdBy: user.userId || null,
    company: data.company || null,
  };

  return normalized;
}

module.exports = normalizeData;
