const Decimal = require("decimal.js");

function calculateOfferTotals(lineItems = [], options = {}) {
  const { showVat, vatRate } = options;

  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    return {
      lineItems,
      priceNetTotal: { value: 0, currency: "TRY" },
      priceListTotal: { value: 0, currency: "TRY" },
      priceVat: { value: 0, currency: "TRY" },
      priceDiscount: { value: 0, currency: "TRY" },
      priceGrandTotal: { value: 0, currency: "TRY" },
    };
  }

  // Currency kontrolü
  const currencies = new Set(
    lineItems.map((item) => item.currencyNet || item.currencyList),
  );
  const currency = currencies.size === 1 ? [...currencies][0] : null;

  if (!currency) {
    return {
      lineItems,
      priceNetTotal: null,
      priceListTotal: null,
      priceVat: null,
      priceDiscount: null,
      priceGrandTotal: null,
    };
  }

  let netTotal = new Decimal(0);
  let listTotal = new Decimal(0);

  const updatedItems = lineItems.map((item) => {
    console.log("Processing item:", item);
    const quantity = new Decimal(item.quantity || 1);
    const priceNet = new Decimal(item.priceNet || 0);
    const priceList = new Decimal(item.priceList || 0);

    const itemNetTotal = priceNet.times(quantity);
    const itemListTotal = priceList.times(quantity);

    netTotal = netTotal.plus(itemNetTotal);
    listTotal = listTotal.plus(itemListTotal);

    return {
      ...item,
      priceNetTotal: { value: itemNetTotal.toNumber(), currency },
      priceListTotal: { value: itemListTotal.toNumber(), currency },
    };
  });

  const discount = listTotal.minus(netTotal);
  const vatDecimal = new Decimal(vatRate).div(100); // %20 → 0.20
  const vat = showVat ? netTotal.times(vatDecimal) : new Decimal(0);
  const grandTotal = showVat ? netTotal.plus(vat) : netTotal;

  return {
    lineItems: updatedItems,
    priceNetTotal: { value: netTotal.toNumber(), currency },
    priceListTotal: { value: listTotal.toNumber(), currency },
    priceVat: { value: vat.toNumber(), currency },
    priceDiscount: { value: discount.toNumber(), currency },
    priceGrandTotal: { value: grandTotal.toNumber(), currency },
  };
}

module.exports = calculateOfferTotals;
