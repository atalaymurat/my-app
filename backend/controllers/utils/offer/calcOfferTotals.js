const Decimal = require("decimal.js");

// ─── Unit Price Hesabı ────────────────────────────────────────────────────────
// priceList / priceNet → data'dan hesaplanır (form değeri yok sayılır)
// priceOffer → kullanıcı girdiyse form değeri, yoksa data'dan hesaplanır

function calcUnitPrices(item) {
  const variantList  = new Decimal(item.variantPriceList  || 0);
  const variantOffer = new Decimal(item.variantPriceOffer || 0);
  const variantNet   = new Decimal(item.variantPriceNet   || 0);

  const options = item.selectedOptions || [];

  const optList  = options.reduce((s, o) => s.plus(new Decimal(o.listPrice  || 0).times(o.quantity || 1)), new Decimal(0));
  const optOffer = options.reduce((s, o) => s.plus(new Decimal(o.offerPrice || 0).times(o.quantity || 1)), new Decimal(0));
  const optNet   = options.reduce((s, o) => s.plus(new Decimal(o.netPrice   || 0).times(o.quantity || 1)), new Decimal(0));

  const priceList = variantList.plus(optList).toNumber();
  const priceNet  = variantNet.plus(optNet).toNumber();

  const formOffer  = new Decimal(item.formPriceOffer || 0);
  const calcOffer  = variantOffer.plus(optOffer);
  const priceOffer = formOffer.gt(0) ? formOffer.toNumber() : calcOffer.toNumber();

  return { priceList, priceOffer, priceNet };
}

// ─── Multi-Currency Toplam Hesabı ─────────────────────────────────────────────
// lineItems sırası korunur; toplamlar currency bazında ayrı hesaplanır.

function calculateOfferTotals(lineItems = [], options = {}) {
  const { showVat, vatRate } = options;

  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    return { lineItems, totalsByCurrency: {} };
  }

  // 1. Her item için unit price ve satır toplamlarını hesapla
  const updatedItems = lineItems.map((item) => {
    const { priceList, priceOffer, priceNet } = calcUnitPrices(item);
    const qty = new Decimal(item.quantity || 1);
    const cur = item.currency || "TRY";

    // Ham variant/form alanlarını DB'ye yazmadan temiz item döndür
    const { variantPriceList, variantPriceOffer, variantPriceNet, formPriceOffer, ...cleanItem } = item;

    return {
      ...cleanItem,
      priceList,
      priceOffer,
      priceNet,
      priceListTotal:  { value: new Decimal(priceList).times(qty).toNumber(),  currency: cur },
      priceOfferTotal: { value: new Decimal(priceOffer).times(qty).toNumber(), currency: cur },
      priceNetTotal:   { value: new Decimal(priceNet).times(qty).toNumber(),   currency: cur },
    };
  });

  // 2. Currency bazında grupla
  const grouped = {};
  updatedItems.forEach((item) => {
    const cur = item.currency || "TRY";
    if (!grouped[cur]) {
      grouped[cur] = {
        listTotal:  new Decimal(0),
        offerTotal: new Decimal(0),
        netTotal:   new Decimal(0),
      };
    }
    grouped[cur].listTotal  = grouped[cur].listTotal.plus(item.priceListTotal.value);
    grouped[cur].offerTotal = grouped[cur].offerTotal.plus(item.priceOfferTotal.value);
    grouped[cur].netTotal   = grouped[cur].netTotal.plus(item.priceNetTotal.value);
  });

  // 3. Her currency için final totals
  const totalsByCurrency = {};
  const vatDecimal = new Decimal(vatRate || 0).div(100);

  Object.entries(grouped).forEach(([currency, data]) => {
    const vat        = showVat ? data.offerTotal.times(vatDecimal) : new Decimal(0);
    const grandTotal = data.offerTotal.plus(vat);

    totalsByCurrency[currency] = {
      priceListTotal:  data.listTotal.toNumber(),
      priceOfferTotal: data.offerTotal.toNumber(),
      priceNetTotal:   data.netTotal.toNumber(),
      priceVat:        vat.toNumber(),
      priceGrandTotal: grandTotal.toNumber(),
    };
  });

  return { lineItems: updatedItems, totalsByCurrency };
}

module.exports = calculateOfferTotals;
