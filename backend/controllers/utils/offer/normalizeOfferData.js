const calculateOfferTotals = require("./calcOfferTotals");
const generateNewCode = require("../generateNewCode");

function normalizeOfferData(formData = {}, userId) {
  const {
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
    lineItems = [],
    showTotals,
    showVat,
    docDate: docDateRaw,
    paymentTerms = "",
    deliveryTerms = "",
    warranty = "",
    priceNetTotal,
    priceListTotal,
    priceVat,
    priceDiscount,
    priceGrandTotal,
    docCode = "",
    docType = "Teklif",
    validDate: validDateRaw,
    vatRate,
    ...rest
  } = formData;

  const address = {
    line1: line1?.trim(),
    line2: line2?.trim(),
    district: district?.trim(),
    city: city?.trim(),
    country: country?.trim(),
  };

  const companyData = {
    title: title?.trim(),
    vatTitle: vatTitle?.trim(),
    emails: email ? [email.trim().toLowerCase()] : [],
    domains: domain ? [domain.trim().toLowerCase()] : [],
    addresses: [address],
  };

  const normalizedLineItems = lineItems.map((item) => {
    const priceList = parseFloat(item.priceList);
    // priceList geçerli değilse 0 kabul et
    const validPriceList = isNaN(priceList) ? 0 : priceList;

    let priceNet = parseFloat(item.priceNet);
    // priceNet geçerli değilse priceList değerini kullan
    if (isNaN(priceNet)) priceNet = validPriceList;

    return {
      productValue: item.productValue,
      title: item.title?.trim(),
      priceList: validPriceList,
      currencyList: item.currencyList || "TRY",
      currencyNet: item.currencyNet || "TRY",
      productVariant: item.productVariant,
      make: item.make?.trim(),
      model: item.model?.trim(),
      year: item.year?.trim(),
      condition: item.condition?.trim(),
      options: item.options || null ,
      createdFromMaster: item.createdFromMaster || false,
      desc: item.desc?.trim(),
      priceNet,
      notes: item.notes?.trim() || "",
      quantity: item.quantity ? parseFloat(item.quantity) : 1,
    };
  });

  const docDate = docDateRaw ? new Date(docDateRaw) : new Date();
  const validDate = validDateRaw
    ? new Date(validDateRaw)
    : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

  // Dilersen toplamları hesaplayıp buraya ekleyebilirsin

  const offerData = {
    docCode:
      docCode ||
      generateNewCode({ type: docType, title: companyData.title, version: 1 }),
    docType,
    company: companyId,
    user: userId,
  };

  const totals = calculateOfferTotals(normalizedLineItems, {
    showVat,
    vatRate: vatRate || 0,
  });

  const versionData = {
    docDate,
    validDate,
    paymentTerms,
    deliveryTerms,
    warranty,
    lineItems: normalizedLineItems,
    ...totals,
    vatRate: vatRate || 0,
    showTotals: showTotals !== undefined ? showTotals : true,
    showVat: showVat !== undefined ? showVat : true,
    createdAt: new Date(),
  };

  return {
    offerData,
    versionData,
    needsCompanyCreation: !companyId,
    companyData: !companyId ? companyData : null,
  };
}

module.exports = normalizeOfferData;
