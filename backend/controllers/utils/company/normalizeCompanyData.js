const formatDomain = require("../formatDomain");
const normalizeAddress = require("../normalizeAddress");
const { transliterate } = require("transliteration");

function normalizeCompanyData(data = {}) {
  function isMaskedEmpty(value) {
    return !value || value.replace(/[_\s\-\(\)\+]/g, "") === "";
  }

  function normalizePhone(phone) {
    if (!phone) return null;
    const digits = phone.replace(/\D/g, ""); // Remove non-digits
    return digits.length >= 7 ? digits : null;
  }

  const normalized = {
    title: data.title?.trim()?.toLowerCase() || "",
    vatTitle: data.vatTitle?.trim()?.toLowerCase() || "",

    phones: Array.isArray(data.phones)
      ? [...new Set(data.phones.map((p) => normalizePhone(p)).filter(Boolean))]
      : [],

    emails: Array.isArray(data.emails)
      ? [
          ...new Set(
            data.emails.map((e) => e.trim().toLowerCase()).filter(Boolean)
          ),
        ]
      : [],

    domains: Array.isArray(data.domains)
      ? [...new Set(data.domains.map(formatDomain).filter(Boolean))]
      : [],

    addresses: Array.isArray(data.addresses)
      ? data.addresses.map(normalizeAddress)
      : [],

    vatNo: !isMaskedEmpty(data.vatNo) ? data.vatNo.trim() : undefined,
    tcNo: !isMaskedEmpty(data.tcNo) ? data.tcNo.trim() : undefined,
    vd: !isMaskedEmpty(data.vd) ? data.vd.trim().toLowerCase() : undefined,

    tags: data.tags || [],
    notes: data.notes || "",
  };

  console.log("NORMALIZED DATA", normalized);

  return normalized;
}

module.exports = normalizeCompanyData;
