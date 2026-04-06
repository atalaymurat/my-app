const calculateOfferTotals = require("./calcOfferTotals");

function shapeLineItems(lineItems = []) {
  return lineItems.map((item) => ({
    productValue: item.productValue,
    variantId: item.selectedVariantId || "",
    title: item.title?.trim() || "",
    caption: item.caption?.trim() || "",
    image: item.image?.trim() || "",
    currency: item.currency || "TRY",
    quantity: Number(item.quantity) || 1,
    condition: item.condition || "",
    notes: item.notes?.trim() || "",
    variantPriceList:  Number(item.variantPriceList) || 0,
    variantPriceOffer: Number(item.variantPriceOffer) || 0,
    variantPriceNet:   Number(item.variantPriceNet) || 0,
    formPriceOffer:    Number(item.priceOffer) || 0,
    selectedOptions: (item.selectedOptions || []).map((o) => ({
      optionId:  o.value,
      quantity:  Number(o.quantity) || 1,
      listPrice: Number(o.listPrice) || 0,
      offerPrice: Number(o.offerPrice) || 0,
      netPrice:  Number(o.netPrice) || 0,
      currency:  o.currency || item.currency || "TRY",
      title: o.label?.trim() || "",
      label: o.label?.trim() || "",
      desc:  o.desc?.trim() || "",
    })),
  }));
}

function normalizeOfferData(formData = {}, userId, orgId) {
  const {
    _id,
    companyId, title, vatTitle, email, domain,
    line1, line2, district, city, country,
    contactId, contactName, contactPhone, contactEmail,
    lineItems = [], showTotals, showVat,
    docDate: docDateRaw, validDate: validDateRaw,
    offerTerms,
    docType = "Teklif", vatRate,
  } = formData;

  const hasCompanyData = title?.trim() || vatTitle?.trim() || email || domain || city;
  if (!companyId && !hasCompanyData) {
    throw new Error("Firma bilgisi eksik: companyId veya companyData gerekli.");
  }

  const companyData = {
    title: title?.trim(),
    vatTitle: vatTitle?.trim(),
    emails:   email  ? [email.trim().toLowerCase()]  : [],
    domains:  domain ? [domain.trim().toLowerCase()] : [],
    addresses: [{
      line1: line1?.trim(), line2: line2?.trim(),
      district: district?.trim(), city: city?.trim(), country: country?.trim(),
    }],
  };

  const docDate  = docDateRaw  ? new Date(docDateRaw)  : new Date();
  const validDate = validDateRaw
    ? new Date(validDateRaw)
    : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

  // docCode and docType are handled by createOffer; pass title for code generation
  const offerData = {
    _id:          _id || undefined,
    title:        companyData.title,   // used by createOffer for docCode generation
    docType,                           // used by createOffer
    company:      companyId,
    createdBy:    userId,
    organization: orgId,
  };

  const totals = calculateOfferTotals(shapeLineItems(lineItems), {
    showVat,
    vatRate: vatRate || 0,
  });

  const versionData = {
    docDate, validDate,
    offerTerms: offerTerms || [],
    lineItems:       totals.lineItems,
    priceListTotal:  totals.priceListTotal,
    priceOfferTotal: totals.priceOfferTotal,
    priceNetTotal:   totals.priceNetTotal,
    priceVat:        totals.priceVat,
    priceDiscount:   totals.priceDiscount,
    priceGrandTotal: totals.priceGrandTotal,
    vatRate:    vatRate || 0,
    showTotals: showTotals !== undefined ? showTotals : true,
    showVat:    showVat   !== undefined ? showVat   : true,
    createdAt:  new Date(),
  };

  return {
    offerData,
    versionData,
    needsCompanyCreation: !companyId,
    companyData: !companyId ? companyData : null,
    contactData: { contactId, contactName, contactPhone, contactEmail },
  };
}

module.exports = normalizeOfferData;
