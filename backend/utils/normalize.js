const { transliterate } = require("transliteration");
const formatDomain = require("../controllers/utils/formatDomain");
const normalizeAddress = require("../controllers/utils/normalizeAddress");

const normalizePhone = (phone) => {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 ? digits : null;
};

const normalizeText = (str) =>
  str ? transliterate(str.trim().toLowerCase()) : "";

const normalizeCompany = (data = {}, userId, orgId) => ({
  title: data.title?.trim()?.toLowerCase() || "",
  vatTitle: data.vatTitle?.trim()?.toLowerCase() || "",
  phones: Array.isArray(data.phones)
    ? [...new Set(data.phones.map(normalizePhone).filter(Boolean))]
    : [],
  emails: Array.isArray(data.emails)
    ? [...new Set(data.emails.map((e) => e.trim().toLowerCase()).filter(Boolean))]
    : [],
  domains: Array.isArray(data.domains)
    ? [...new Set(data.domains.map(formatDomain).filter(Boolean))]
    : [],
  addresses: Array.isArray(data.addresses)
    ? data.addresses.map(normalizeAddress)
    : [],
  vatNo: data.vatNo?.trim() || undefined,
  tcNo: data.tcNo?.trim() || undefined,
  vd: data.vd?.trim()?.toLowerCase() || undefined,
  tags: data.tags || [],
  notes: data.notes || "",
  createdBy: userId,
  organization: orgId,
});

const normalizeOption = (data = {}, userId, orgId) => ({
  title: data.title?.trim() || "",
  nTitle: normalizeText(data.title),
  masterProducts: Array.isArray(data.masterProducts)
    ? data.masterProducts.filter(Boolean)
    : [],
  image: data.image?.trim() || "",
  description: data.description ? normalizeText(data.description) : "",
  priceNet: data.priceNet,
  priceList: data.priceList,
  priceOffer: data.priceOffer,
  currency: data.currency,
  make: data.make,
  createdBy: userId,
  organization: orgId,
});

const normalizeMasterProduct = (data = {}, userId, orgId) => ({
  title: data.model?.trim()?.toLowerCase() || "",
  nTitle: normalizeText(data.model),
  description: data.description || "",
  nDescription: normalizeText(data.description),
  make: data.make,
  model: data.model?.trim()?.toLowerCase() || "",
  nModel: data.model ? normalizeText(data.model) : "",
  variants: data.variants,
  caption: data.caption ? transliterate(data.caption) : "",
  currency: data.currency,
  condition: data.condition,
  year: data.year,
  createdBy: userId,
  organization: orgId,
});

module.exports = {
  normalizeCompany,
  normalizeOption,
  normalizeMasterProduct,
  normalizePhone,
  normalizeText,
};
