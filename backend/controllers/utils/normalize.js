const { transliterate } = require("transliteration")

const normalizePhone = (phone) => {
  if (!phone) return null
  const digits = phone.replace(/\D/g, "")
  return digits.length >= 7 ? digits : null
}

const normalizeText = (text = "") => {
  return transliterate(String(text)).toLowerCase().trim().replace(/\s+/g, " ")
}

const compactParts = (parts = []) =>
  parts.map((part) => String(part || "").trim()).filter(Boolean)

const splitContactDisplayName = (displayName = "") => {
  const parts = compactParts(String(displayName).split(/\s+/))
  if (!parts.length) return {}
  if (parts.length === 1) return { givenName: parts[0] }
  if (parts.length === 2) return { givenName: parts[0], familyName: parts[1] }

  return {
    givenName: parts[0],
    middleName: parts.slice(1, -1).join(" "),
    familyName: parts[parts.length - 1],
  }
}

const buildContactDisplayName = (data = {}) =>
  compactParts([data.givenName, data.middleName, data.familyName]).join(" ")

const normalizeContactNameParts = (data = {}) => {
  const parts = {
    givenName: data.givenName?.trim() || undefined,
    middleName: data.middleName?.trim() || undefined,
    familyName: data.familyName?.trim() || undefined,
  }

  if (parts.givenName || parts.middleName || parts.familyName) return parts

  return {}
}

const normalizeEmailList = (emails = []) =>
  Array.isArray(emails)
    ? [...new Set(emails.map((e) => String(e || "").trim().toLowerCase()).filter(Boolean))]
    : []

const normalizePhoneList = (phones = []) =>
  Array.isArray(phones)
    ? [...new Set(phones.map((phone) => String(phone || "").trim()).filter(Boolean))]
    : []

const normalizeAddress = (address = {}) => ({
  ...address,
  normalizedLine1: normalizeText(address.line1),
  normalizedLine2: normalizeText(address.line2),
  normalizedCity: normalizeText(address.city),
  normalizedDistrict: normalizeText(address.district),
  normalizedCountry: normalizeText(address.country),
})

const formatDomain = (domain) => {
  if (domain && typeof domain === "string") {
    // Remove protocol (http:// or https://), "www.", and any trailing slashes
    return domain
      .replace(/^https?:\/\//, "") // Remove http:// or https://
      .replace(/^www\./, "") // Remove www.
      .replace(/\/$/, "") // Remove trailing slash
      .toLowerCase() // Ensure the domain is lowercase
  }
  return domain
}

const normalizeCompany = (data = {}, userId, orgId) => ({
  title: data.title?.trim() || "",
  normalizedTitle: normalizeText(data.title),

  vatTitle: data.vatTitle?.trim() || "",
  normalizedVatTitle: normalizeText(data.vatTitle),

  phones: Array.isArray(data.phones)
    ? [...new Set(data.phones.map(normalizePhone).filter(Boolean))]
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

  vatNo: data.vatNo?.trim() || undefined,
  tcNo: data.tcNo?.trim() || undefined,
  vd: data.vd?.trim()?.toLowerCase() || undefined,

  ogImage: data.ogImage || "",
  favicon: data.favicon || "",
  description: data.description || "",

  tags: Array.isArray(data.tags) ? data.tags : [],
  notes: data.notes || "",

  createdBy: userId,
  organization: orgId,
});

const normalizeOption = (data = {}, userId) => ({
  title: data.title?.trim() || "",
  nTitle: normalizeText(data.title),
  image: data.image?.trim() || "",
  description: data.description ? normalizeText(data.description) : "",
  priceNet: data.priceNet,
  priceList: data.priceList,
  priceOffer: data.priceOffer,
  currency: data.currency,
  make: data.make,
  createdBy: userId,
})

const normalizeMasterProduct = (data = {}, userId) => ({
  title: data.model?.trim()?.toLowerCase() || "",
  nTitle: normalizeText(data.model),
  desc: data.desc || "",
  make: data.make,
  model: data.model?.trim()?.toLowerCase() || "",
  nModel: data.model ? normalizeText(data.model) : "",
  variants: data.variants,
  caption: data.caption ? transliterate(data.caption) : "",
  image: data.image || "",
  currency: data.currency,
  condition: data.condition,
  year: data.year,
  options: Array.isArray(data.options) ? data.options.filter(Boolean) : [],
  createdBy: userId,
})

const normalizeContact = (data = {}, userId, orgId) => {
  const nameParts = normalizeContactNameParts(data)
  const displayName = buildContactDisplayName(nameParts)
  const phoneSource = Array.isArray(data.formattedPhones) ? data.formattedPhones : data.phones

  return {
    displayName,
    normalizedName: normalizeText(displayName),
    givenName: nameParts.givenName,
    middleName: nameParts.middleName,
    familyName: nameParts.familyName,

    gender: data.gender || "none",

    phones: normalizePhoneList(phoneSource),
    emails: normalizeEmailList(data.emails),
    googleLabels: Array.isArray(data.googleLabels)
      ? data.googleLabels.map((label) => String(label || "").trim()).filter(Boolean)
      : [],

    company: data.company || undefined,
    source: data.source || "manual",
    sourceType: data.sourceType || "manual",
    sourceRowHash: data.sourceRowHash || undefined,
    importedAt: data.importedAt || undefined,

    createdBy: userId,
    organization: orgId,
  }
}

const normalizeContactUpdate = (data = {}) => {
  const updateData = {}

  if (
    data.givenName !== undefined ||
    data.middleName !== undefined ||
    data.familyName !== undefined
  ) {
    const nameParts = normalizeContactNameParts(data)
    const displayName = buildContactDisplayName(nameParts)

    updateData.displayName = displayName
    updateData.normalizedName = normalizeText(displayName)
    updateData.givenName = nameParts.givenName
    updateData.middleName = nameParts.middleName
    updateData.familyName = nameParts.familyName
  }

  if (data.gender !== undefined) {
    updateData.gender = data.gender || "none"
  }

  if (data.emails !== undefined) {
    updateData.emails = normalizeEmailList(data.emails)
  }

  if (data.formattedPhones !== undefined || data.phones !== undefined) {
    const phoneSource = data.formattedPhones || data.phones

    updateData.phones = normalizePhoneList(phoneSource)
  }

  if (data.company !== undefined) {
    updateData.company = data.company || undefined
  }

  if (data.source !== undefined) {
    updateData.source = data.source || "manual"
  }

  if (data.sourceType !== undefined) {
    updateData.sourceType = data.sourceType || "manual"
  }

  if (data.sourceRowHash !== undefined) {
    updateData.sourceRowHash = data.sourceRowHash || undefined
  }

  if (data.importedAt !== undefined) {
    updateData.importedAt = data.importedAt || undefined
  }

  if (data.googleLabels !== undefined) {
    updateData.googleLabels = Array.isArray(data.googleLabels)
      ? data.googleLabels.map((label) => String(label || "").trim()).filter(Boolean)
      : []
  }

  return updateData
}

module.exports = {
  normalizeCompany,
  normalizeContact,
  normalizeContactUpdate,
  normalizeOption,
  normalizeMasterProduct,
  normalizePhone,
  normalizeText,
  buildContactDisplayName,
  splitContactDisplayName,
  normalizeAddress,
  formatDomain,
}
