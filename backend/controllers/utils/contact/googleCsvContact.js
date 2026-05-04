const crypto = require("crypto");
const { normalizeText } = require("../normalize");

function compactParts(parts) {
  return parts.map((part) => String(part || "").trim()).filter(Boolean);
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function splitLabels(value = "") {
  return String(value)
    .split(":::")
    .map((label) => label.trim())
    .filter(Boolean);
}

function collectNumberedValues(row = {}, prefix) {
  const pattern = new RegExp(`^${prefix} (\\d+) - Value$`);

  return Object.entries(row)
    .map(([key, value]) => {
      const match = key.match(pattern);
      if (!match) return null;
      return { index: Number(match[1]), value };
    })
    .filter(Boolean)
    .sort((a, b) => a.index - b.index)
    .map((entry) => String(entry.value || "").trim())
    .filter(Boolean);
}

function buildGoogleCsvContactDisplayName(row = {}) {
  return compactParts([row["First Name"], row["Middle Name"], row["Last Name"]]).join(" ");
}

function buildContactSourceRowHash(payload = {}) {
  const stable = {
    givenName: payload.givenName || "",
    middleName: payload.middleName || "",
    familyName: payload.familyName || "",
    emails: payload.emails || [],
    phones: payload.phones || [],
  };

  return crypto.createHash("sha256").update(JSON.stringify(stable)).digest("hex");
}

function normalizeGoogleCsvContactRow(row = {}, userId, orgId) {
  const givenName = String(row["First Name"] || "").trim();
  const middleName = String(row["Middle Name"] || "").trim();
  const familyName = String(row["Last Name"] || "").trim();
  const displayName = buildGoogleCsvContactDisplayName(row);
  const emails = [...new Set(collectNumberedValues(row, "E-mail").map(normalizeEmail).filter(Boolean))];
  const phones = [
    ...new Set(
      collectNumberedValues(row, "Phone")
        .map((phone) => phone.trim())
        .filter(Boolean),
    ),
  ];
  const googleLabels = splitLabels(row.Labels);
  const payload = {
    displayName,
    normalizedName: normalizeText(displayName),
    givenName,
    middleName,
    familyName,
    emails,
    phones,
    googleLabels,
    source: "google",
    sourceType: "google_csv",
    importedAt: new Date(),
    createdBy: userId,
    organization: orgId,
  };

  payload.sourceRowHash = buildContactSourceRowHash(payload);

  return payload;
}

module.exports = {
  buildContactSourceRowHash,
  buildGoogleCsvContactDisplayName,
  normalizeGoogleCsvContactRow,
};
