const calculateOfferTotals = require("./calcOfferTotals");
const generateNewCode = require("../generateNewCode");
const Decimal = require("decimal.js");

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

  // ✅ companyData oluşturulacaksa, en az title olmalı
  const hasCompanyData =
    title?.trim() || vatTitle?.trim() || email || domain || city;

  // ❌ companyId ve companyData yoksa: işlemi durdur
  if (!companyId && !hasCompanyData) {
    throw new Error("Firma bilgisi eksik: companyId veya companyData gerekli.");
  }

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
    const basePrice = new Decimal(item.basePrice || 0);
    const quantity = new Decimal(item.quantity || 1);

    const optionsTotal = (item.selectedOptions || []).reduce(
      (sum, opt) =>
        sum.plus(
          new Decimal(opt.listPrice || 0).times(new Decimal(opt.quantity || 1)),
        ),
      new Decimal(0),
    );
    const priceNet = new Decimal(item.priceNet || 0)
    const unitPrice = basePrice.plus(optionsTotal);

    return {
      productValue: item.productValue,
      title: item.title?.trim(),

      basePrice: basePrice.toNumber(), // saklamak istiyorsan
      priceList: unitPrice.toNumber(), // backend hesapladı
      priceNet: priceNet.toNumber(), // şimdilik net = list

      currency: item.currency || "TRY",

      quantity: quantity.toNumber(),

      selectedOptions: (item.selectedOptions || []).map((opt) => ({
        optionId: opt.value,
        quantity: opt.quantity || 1,
        currency: opt.currency,
        desc: opt.desc,
        unitPrice: opt.listPrice,
      })),

      desc: item.desc?.trim(),
      notes: item.notes?.trim() || "",
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
  console.log("Normalized Line İtems", normalizedLineItems)

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
