const Decimal = require("decimal.js");

// ─── Unit Price Hesabı ────────────────────────────────────────────────────────
// Tüm fiyat matematiği bu dosyadan yönetilir.
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

  // priceOffer: kullanıcı override varsa kullan, yoksa hesapla
  const formOffer = new Decimal(item.formPriceOffer || 0);
  const calcOffer = variantOffer.plus(optOffer);
  const priceOffer = formOffer.gt(0) ? formOffer.toNumber() : calcOffer.toNumber();

  return { priceList, priceOffer, priceNet };
}

// ─── Toplam Hesabı ────────────────────────────────────────────────────────────

function calculateOfferTotals(lineItems = [], options = {}) {
  const { showVat, vatRate } = options;

  const empty = { value: 0, currency: "TRY" };

  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    return {
      lineItems,
      priceListTotal: empty,
      priceOfferTotal: empty,
      priceNetTotal: empty,
      priceVat: empty,
      priceDiscount: empty,
      priceGrandTotal: empty,
    };
  }

  const currencies = new Set(lineItems.map((i) => i.currency));
  const currency = currencies.size === 1 ? [...currencies][0] : null;

  if (!currency) {
    return {
      lineItems,
      priceListTotal: null, priceOfferTotal: null, priceNetTotal: null,
      priceVat: null, priceDiscount: null, priceGrandTotal: null,
    };
  }

  let listTotal  = new Decimal(0);
  let offerTotal = new Decimal(0);
  let netTotal   = new Decimal(0);

  const updatedItems = lineItems.map((item) => {
    const { priceList, priceOffer, priceNet } = calcUnitPrices(item);
    const qty = new Decimal(item.quantity || 1);

    const itemListTotal  = new Decimal(priceList).times(qty);
    const itemOfferTotal = new Decimal(priceOffer).times(qty);
    const itemNetTotal   = new Decimal(priceNet).times(qty);

    listTotal  = listTotal.plus(itemListTotal);
    offerTotal = offerTotal.plus(itemOfferTotal);
    netTotal   = netTotal.plus(itemNetTotal);

    // Ham variant/form alanlarını DB'ye yazmadan temiz item döndür
    const { variantPriceList, variantPriceOffer, variantPriceNet, formPriceOffer, ...cleanItem } = item;

    return {
      ...cleanItem,
      priceList,
      priceOffer,
      priceNet,
      priceListTotal:  { value: itemListTotal.toNumber(),  currency },
      priceOfferTotal: { value: itemOfferTotal.toNumber(), currency },
      priceNetTotal:   { value: itemNetTotal.toNumber(),   currency },
    };
  });

  const discount   = listTotal.minus(offerTotal);
  const vatDecimal = new Decimal(vatRate).div(100);
  const vat        = showVat ? offerTotal.times(vatDecimal) : new Decimal(0);
  const grandTotal = offerTotal.plus(vat);

  return {
    lineItems: updatedItems,
    priceListTotal:  { value: listTotal.toNumber(),  currency },
    priceOfferTotal: { value: offerTotal.toNumber(), currency },
    priceNetTotal:   { value: netTotal.toNumber(),   currency },
    priceVat:        { value: vat.toNumber(),        currency },
    priceDiscount:   { value: discount.toNumber(),   currency },
    priceGrandTotal: { value: grandTotal.toNumber(), currency },
  };
}

module.exports = calculateOfferTotals;
