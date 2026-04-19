import * as Yup from "yup";

export const DOC_TYPES = ["Teklif", "Proforma", "Sipariş", "Sözleşme"];
export const DOC_TYPE_MAP = { Teklif: "offer", Proforma: "proforma", Sipariş: "contract", Sözleşme: "contract" };
export const CURRENCIES = ["EUR", "USD", "TRY", "GBP"];

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
    .min(1, "En az bir ürün/hizmet ekleyin")
    .of(
      Yup.object({
        title: Yup.string().trim().required("Ürün adı zorunludur"),
        priceOffer: Yup.number()
          .typeError("Fiyat sayı olmalı")
          .positive("Fiyat 0'dan büyük olmalı")
          .required("Fiyat zorunludur"),
      })
    ),
});

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
  lineItems: [{ title: "", priceOffer: "", currency: "EUR", quantity: 1, notes: "" }],
  vatRate: 20,
  showVat: true,
  showTotals: true,
  offerTerms: [],
};
