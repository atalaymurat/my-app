const Decimal = require("decimal.js");

function calculateOfferTotals(lineItems = [], options = {}) {
  const { showVat = true, vatRate = 0.2 } = options;

  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    return {
      priceNetTotal: { value: 0, currency: "TRY" },
      priceListTotal: { value: 0, currency: "TRY" },
      priceVat: { value: 0, currency: "TRY" },
      priceDiscount: { value: 0, currency: "TRY" },
      priceGrandTotal: { value: 0, currency: "TRY" },
    };
  }

  const currencies = new Set(lineItems.map(item => item.currencyNet || item.currencyList));
  const currency = currencies.size === 1 ? [...currencies][0] : null;

  if (!currency) {
    return {
      priceNetTotal: null,
      priceListTotal: null,
      priceVat: null,
      priceDiscount: null,
      priceGrandTotal: null,
    };
  }

  const netTotal = lineItems.reduce((sum, item) => {
    const val = new Decimal(item.priceNet || 0);
    return sum.plus(val);
  }, new Decimal(0));

  const listTotal = lineItems.reduce((sum, item) => {
    const val = new Decimal(item.priceList || 0);
    return sum.plus(val);
  }, new Decimal(0));

  const discount = listTotal.minus(netTotal);

  const vatDecimal = new Decimal(vatRate);

  const vat = showVat ? netTotal.times(vatDecimal) : new Decimal(0);

  const grandTotal = showVat ? netTotal.plus(vat) : netTotal;

  return {
    priceNetTotal: { value: netTotal.toNumber(), currency },
    priceListTotal: { value: listTotal.toNumber(), currency },
    priceVat: { value: vat.toNumber(), currency },
    priceDiscount: { value: discount.toNumber(), currency },
    priceGrandTotal: { value: grandTotal.toNumber(), currency },
  };
}

module.exports = calculateOfferTotals;
