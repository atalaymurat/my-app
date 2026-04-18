const calculateOfferTotals = require("../offer/calcOfferTotals");

function shapeSimpleLineItems(lineItems = []) {
  return lineItems.map((item) => ({
    productValue: "",
    variantId: "",
    title: item.title?.trim() || "",
    caption: "",
    productDesc: "",
    variantDesc: "",
    image: "",
    currency: item.currency || "TRY",
    quantity: Number(item.quantity) || 1,
    condition: "",
    notes: item.notes?.trim() || "",
    variantPriceList: 0,
    variantPriceOffer: 0,
    variantPriceNet: 0,
    formPriceOffer: Number(item.priceOffer) || 0,
    priceListId: undefined,
    selectedOptions: [],
  }));
}

function normalizeSimpleOffer(formData = {}, userId, orgId) {
  const {
    _id,
    companyId,
    title,
    vatTitle,
    email,
    domain,
    line1,
    line2,
    district,
    city,
    country,
    contactId,
    contactName,
    contactPhone,
    contactEmail,
    lineItems = [],
    showTotals,
    showVat,
    docDate: docDateRaw,
    validDate: validDateRaw,
    offerTerms,
    docType = "Teklif",
    vatRate,
  } = formData;

  const hasCompanyData = title?.trim() || vatTitle?.trim() || email || domain || city;
  if (!companyId && !hasCompanyData) {
    throw new Error("Firma bilgisi eksik: companyId veya companyData gerekli.");
  }

  const companyData = {
    title: title?.trim(),
    vatTitle: vatTitle?.trim(),
    emails: email ? [email.trim().toLowerCase()] : [],
    domains: domain ? [domain.trim().toLowerCase()] : [],
    addresses: [{
      line1: line1?.trim(),
      line2: line2?.trim(),
      district: district?.trim(),
      city: city?.trim(),
      country: country?.trim(),
    }],
  };

  const docDate = docDateRaw ? new Date(docDateRaw) : new Date();
  const validDate = validDateRaw
    ? new Date(validDateRaw)
    : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

  const offerData = {
    _id: _id || undefined,
    title: companyData.title,
    docType,
    company: companyId,
    createdBy: userId,
    organization: orgId,
    template: "simple",
  };

  const totals = calculateOfferTotals(shapeSimpleLineItems(lineItems), {
    vatRate: vatRate ? Number(vatRate) : 0.2,
    showVat: Boolean(showVat),
    showTotals: Boolean(showTotals),
  });

  const versionData = {
    docType,
    docDate,
    validDate,
    lineItems: totals.lineItems,
    totalsByCurrency: totals.totalsByCurrency,
    vatRate: vatRate ? Number(vatRate) : 0.2,
    showTotals: Boolean(showTotals),
    showVat: Boolean(showVat),
    offerTerms: Array.isArray(offerTerms) && offerTerms.length ? offerTerms : [],
  };

  const contactData = {
    contactId,
    contactName: contactName?.trim(),
    contactPhone: contactPhone?.trim(),
    contactEmail: contactEmail?.trim(),
  };

  return {
    offerData,
    versionData,
    needsCompanyCreation: !companyId && hasCompanyData,
    companyData: !companyId ? companyData : null,
    contactData,
  };
}

module.exports = normalizeSimpleOffer;
