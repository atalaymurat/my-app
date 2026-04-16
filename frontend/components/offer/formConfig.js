"use client";
import * as Yup from "yup";

export const validationSchema = Yup.object({
  title: Yup.string().when("companyId", {
    is: (val) => !val,
    then: (s) => s.trim().required("Firma adı zorunludur"),
    otherwise: (s) => s,
  }),
  city: Yup.string().when("companyId", {
    is: (val) => !val,
    then: (s) => s.trim().required("Şehir zorunludur"),
    otherwise: (s) => s,
  }),
  country: Yup.string().when("companyId", {
    is: (val) => !val,
    then: (s) => s.trim().required("Ülke zorunludur"),
    otherwise: (s) => s,
  }),
  lineItems: Yup.array()
    .min(1, "En az bir ürün/hizmet eklemelisiniz")
    .of(
      Yup.object({
        title: Yup.string().trim().required("Ürün adı zorunludur"),
      }),
    ),
});

export const DEFAULT_LINE_ITEM = {
  title: "",
  priceList: "",
  priceOffer: "",
  priceNet: "",
  currency: "",
  productValue: "",
  condition: "",
  image: "",
  caption: "",
  notes: "",
  quantity: 1,
  options: [],
  selectedOptions: [],
  selectedMakeId: "",
  selectedPriceListId: "",
  selectedVariantId: "",
  variantPriceList: 0,
  variantPriceOffer: 0,
  variantPriceNet: 0,
  makeName: "",
  variantCode: "",
  variantModel: "",
  productDesc: "",
  variantDesc: "",
};

export const DEFAULT_VALUES = {
  docType: "Teklif",
  search: "",
  companyId: "",
  contactId: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  title: "",
  vatTitle: "",
  email: "",
  domain: "",
  line1: "",
  line2: "",
  district: "",
  city: "",
  country: "",
  lineItems: [{ ...DEFAULT_LINE_ITEM }],
  vatRate: 20,
  showVat: true,
  showTotals: true,
  priceListId: "",
  snapshotVersion: null,
  offerTerms: [],
};

export function mapOfferToForm(offer) {
  const lastVersion = offer.versions[offer.versions.length - 1];
  const co = offer.company || {};
  const addr = co.addresses?.[0] || {};

  return {
    ...DEFAULT_VALUES,
    _id: offer._id,
    docType: lastVersion?.docType || "Teklif",
    priceListId: lastVersion?.priceListId || "",
    snapshotVersion: lastVersion?.snapshotVersion || null,
    companyId: co._id || "",
    title: co.title || "",
    vatTitle: co.vatTitle || "",
    email: co.emails?.[0] || "",
    domain: co.domains?.[0] || "",
    line1: addr.line1 || "",
    line2: addr.line2 || "",
    district: addr.district || "",
    city: addr.city || "",
    country: addr.country || "",
    contactId: offer.contact?._id || "",
    contactName: offer.contact?.name || "",
    contactPhone: offer.contact?.phones?.[0] || "",
    contactEmail: offer.contact?.emails?.[0] || "",
    vatRate: lastVersion?.vatRate ?? 20,
    showVat: lastVersion?.showVat ?? true,
    showTotals: lastVersion?.showTotals ?? true,
    lineItems:
      (lastVersion?.lineItems || []).map((item) => ({
        ...DEFAULT_LINE_ITEM,
        title: item.title || "",
        caption: item.caption || "",
        productDesc: item.productDesc || "",
        variantDesc: item.variantDesc || "",
        productValue: item.productValue || "",
        selectedPriceListId: item.priceListId || lastVersion?.priceListId || "",
        selectedVariantId: item.variantId || "",
        selectedOptions: (item.selectedOptions || []).map((o) => ({
          value: o.optionId,
          label: o.label || o.title || "",
          listPrice: o.listPrice,
          offerPrice: o.offerPrice,
          netPrice: o.netPrice,
          currency: o.currency,
          desc: o.desc,
          quantity: o.quantity,
          image: o.image || "",
        })),
        priceList: item.priceList || "",
        priceOffer: item.priceOffer || "",
        priceNet: item.priceNet || "",
        variantPriceList: item.variantPriceList || item.priceList || 0,
        variantPriceOffer: item.variantPriceOffer || item.priceOffer || 0,
        variantPriceNet: item.variantPriceNet || item.priceNet || 0,
        currency: item.currency || "",
        quantity: item.quantity || 1,
        notes: item.notes || "",
        condition: item.condition || "",
        image: item.image || "",
        makeName: item.makeName || "",
        variantCode: item.variantCode || "",
        variantModel: item.variantModel || "",
      })) || [{ ...DEFAULT_LINE_ITEM }],
    offerTerms: (lastVersion?.offerTerms || []).map((t) => ({
      key: t.key,
      label: t.label,
      fieldType: t.fieldType,
      options: t.options || [],
      value: t.value,
      isEditable: t.isEditable,
      isVisible: t.isVisible,
      visibleIn: t.visibleIn || [],
    })),
  };
}
