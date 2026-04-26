const { transliterate } = require("transliteration")

const normalizePhone = (phone) => {
  if (!phone) return null
  const digits = phone.replace(/\D/g, "")
  return digits.length >= 7 ? digits : null
}

const normalizeText = (text = "") => {
  return transliterate(String(text)).toLowerCase().trim().replace(/\s+/g, " ")
}

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

const normalizeContact = (data = {}, userId, orgId) => ({
  name: data.name?.trim() || "",
  normalizedName: normalizeText(data.name),

  gender: data.gender || "none",

  phones: Array.isArray(data.formattedPhones)
    ? data.formattedPhones.filter(Boolean)
    : Array.isArray(data.phones)
      ? data.phones.filter(Boolean)
      : [],

  emails: Array.isArray(data.emails)
    ? data.emails.map((e) => e.trim().toLowerCase()).filter(Boolean)
    : [],

  company: data.company || undefined,

  createdBy: userId,
  organization: orgId,
})

const normalizeContactUpdate = (data = {}) => {
  const updateData = {}

  if (data.name !== undefined) {
    updateData.name = data.name.trim()
    updateData.normalizedName = normalizeText(data.name)
  }

  if (data.gender !== undefined) {
    updateData.gender = data.gender || "none"
  }

  if (data.emails !== undefined) {
    updateData.emails = Array.isArray(data.emails)
      ? data.emails.map((e) => e.trim().toLowerCase()).filter(Boolean)
      : []
  }

  if (data.formattedPhones !== undefined || data.phones !== undefined) {
    const phoneSource = data.formattedPhones || data.phones

    updateData.phones = Array.isArray(phoneSource)
      ? phoneSource.filter(Boolean)
      : []
  }

  if (data.company !== undefined) {
    updateData.company = data.company || undefined
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
  normalizeAddress,
  formatDomain,
}
