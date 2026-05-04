const crypto = require("crypto");
const { normalizeText } = require("../normalize");

const EMAIL_COLUMNS = ["İş e-postası", "Kişisel e-posta", "Diğer e-posta"];
const PHONE_COLUMNS = [
  "İş telefonu",
  "İş DD telefonu",
  "Cep telefonu",
  "Faks",
  "Ev telefonu",
  "Diğer telefon",
];

function compactValues(values = []) {
  return values.map((value) => String(value || "").trim()).filter(Boolean);
}

function uniqueValues(values = []) {
  return [...new Set(compactValues(values))];
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function splitEmailValues(value) {
  return String(value || "")
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);
}

function buildKommoCsvContactDisplayName(row = {}) {
  return compactValues([row["Ad"], row["Soyisim"]]).join(" ");
}

function buildKommoSourceRowHash(payload = {}, row = {}) {
  const kommoId = String(row.ID || "").trim();
  if (kommoId) return `kommo:${kommoId}`;

  const stable = {
    givenName: payload.givenName || "",
    middleName: payload.middleName || "",
    familyName: payload.familyName || "",
    emails: payload.emails || [],
    phones: payload.phones || [],
  };

  return crypto.createHash("sha256").update(JSON.stringify(stable)).digest("hex");
}

function normalizeKommoCsvContactRow(row = {}, userId, orgId) {
  const givenName = String(row["Ad"] || "").trim();
  const middleName = "";
  const familyName = String(row["Soyisim"] || "").trim();
  const displayName = buildKommoCsvContactDisplayName(row);
  const emails = uniqueValues(EMAIL_COLUMNS.flatMap((column) => splitEmailValues(row[column])));
  const phones = uniqueValues(PHONE_COLUMNS.map((column) => row[column]));
  const payload = {
    displayName,
    normalizedName: normalizeText(displayName),
    givenName,
    middleName,
    familyName,
    emails,
    phones,
    source: "kommo",
    sourceType: "kommo_csv",
    importedAt: new Date(),
    createdBy: userId,
    organization: orgId,
  };

  payload.sourceRowHash = buildKommoSourceRowHash(payload, row);

  return payload;
}

module.exports = {
  EMAIL_COLUMNS,
  PHONE_COLUMNS,
  buildKommoCsvContactDisplayName,
  buildKommoSourceRowHash,
  normalizeKommoCsvContactRow,
};
