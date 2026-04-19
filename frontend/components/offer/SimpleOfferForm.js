"use client";
import { useState, useEffect, useRef } from "react";
import { Formik, Form, FieldArray, useFormikContext } from "formik";
import * as Yup from "yup";
import axios from "@/utils/axios";
import axiosOrg from "@/utils/axiosOrg";
import { useRouter } from "next/navigation";
import FormikControl from "@/components/formik/FormikControl";
import ContactFields from "@/components/company/ContactFields";
import MessageBlock from "@/components/messageBlock";

const DOC_TYPES = ["Teklif", "Proforma", "Sipariş", "Sözleşme"];
const DOC_TYPE_MAP = { Teklif: 'offer', Proforma: 'proforma', Sipariş: 'contract', Sözleşme: 'contract' };
const CURRENCIES = ["EUR", "USD", "TRY", "GBP"];

const validationSchema = Yup.object({
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

const DEFAULT_VALUES = {
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
  lineItems: [
    { title: "", priceOffer: "", currency: "EUR", quantity: 1, notes: "" },
  ],
  vatRate: 20,
  showVat: true,
  showTotals: true,
  offerTerms: [],
};

function CompanySearch() {
  const { values, setFieldValue } = useFormikContext();
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const skipRef = useRef(false);

  useEffect(() => {
    if (skipRef.current) {
      skipRef.current = false;
      return;
    }
    if (!values.search || values.search.length < 2) {
      setSearchResults([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const { data } = await axios.get(`/api/company/find?search=${values.search}`);
        if (data.success) {
          setSearchResults(data.companies || []);
          setShowDropdown(true);
        }
      } catch {
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [values.search]);

  const onSelect = (c) => {
    skipRef.current = true;
    ["companyId", "title", "vatTitle", "email", "domain", "city", "line1", "line2", "country", "district"].forEach(
      (k) => setFieldValue(k, c[k === "companyId" ? "id" : k] || "")
    );
    setFieldValue("search", "");
    setShowDropdown(false);
    setSearchResults([]);
  };

  const onClear = () => {
    ["companyId", "title", "vatTitle", "email", "domain", "city", "line1", "line2", "country", "district", "search"].forEach(
      (k) => setFieldValue(k, "")
    );
    setShowDropdown(false);
    setSearchResults([]);
  };

  return (
    <div className="rounded-xl border border-stone-700 overflow-hidden">
      <div className="px-4 py-2.5 bg-stone-900/70 border-b border-stone-700 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Firma</p>
        {values.companyId && <span className="text-xs font-semibold text-blue-400">✓ Bağlı</span>}
      </div>
      <div className="p-4 sm:p-5 space-y-3">
        {values.companyId ? (
          <div className="flex items-center gap-3 p-3 bg-blue-950/30 border border-blue-800/40 rounded-xl">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center">
              <span className="text-base font-black text-blue-300">{values.title?.[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-blue-200 truncate">{values.title}</p>
              <p className="text-xs text-stone-500 truncate mt-0.5">
                {[values.domain, values.city, values.country].filter(Boolean).join(" · ")}
              </p>
            </div>
            <button
              type="button"
              onClick={onClear}
              className="shrink-0 w-7 h-7 rounded-lg bg-stone-800 hover:bg-red-900/40 border border-stone-700 hover:border-red-700/50 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            <div className="relative">
              <input
                type="text"
                placeholder="Firma ara..."
                autoComplete="off"
                value={values.search}
                onChange={(e) => setFieldValue("search", e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-600 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 rounded-xl border border-stone-700 bg-stone-900 shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
                  {searchResults.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => onSelect(c)}
                      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-stone-800 transition-colors border-b border-stone-800 last:border-0"
                    >
                      <div className="w-7 h-7 rounded-lg bg-stone-700 flex items-center justify-center shrink-0">
                        <span className="text-xs text-stone-300 font-bold">{c.title?.[0]?.toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-stone-200 font-semibold truncate">{c.title}</p>
                        <p className="text-xs text-stone-500">{[c.city, c.country].filter(Boolean).join(", ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <FormikControl control="input" type="text" label="Firma Adı *" name="title" />
              <FormikControl control="input" type="text" label="Tam Unvan" name="vatTitle" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <FormikControl control="input" type="email" label="Email" name="email" />
              <FormikControl control="input" type="text" label="Web / Domain" name="domain" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <FormikControl control="input" type="text" label="Şehir *" name="city" />
              <FormikControl control="input" type="text" label="Ülke *" name="country" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function LineItemsSection() {
  const { values, setFieldValue, errors, touched } = useFormikContext();

  return (
    <div className="rounded-xl border border-stone-700 overflow-hidden">
      <div className="px-4 py-2.5 bg-stone-900/70 border-b border-stone-700">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Ürünler / Hizmetler</p>
      </div>
      <div className="p-4 sm:p-5 space-y-3">
        <FieldArray name="lineItems">
          {({ push, remove }) => (
            <>
              {values.lineItems.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-stone-700 bg-stone-900/40 overflow-hidden">
                  {/* Desktop: Two-row layout */}
                  <div className="hidden sm:block p-4 space-y-3">
                    {/* Row 1: Number + Product Name + Delete */}
                    <div className="flex items-center gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-md bg-amber-500/20 border border-amber-600/30 flex items-center justify-center text-[10px] font-black text-amber-400">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <FormikControl control="input" type="text" label="" name={`lineItems.${idx}.title`} placeholder="Ürün / Hizmet Adı" />
                      </div>
                      {values.lineItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(idx)}
                          className="shrink-0 w-7 h-7 rounded-lg bg-stone-800 hover:bg-red-900/40 text-stone-400 hover:text-red-400 transition-colors flex items-center justify-center text-lg"
                        >
                          −
                        </button>
                      )}
                    </div>

                    {/* Row 2: Price + Currency + Quantity */}
                    <div className="grid grid-cols-[1fr_auto_100px] gap-3 items-center">
                      {/* Fiyat */}
                      <div>
                        <label className="text-[10px] text-stone-500 font-bold uppercase mb-1.5 block">Fiyat</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.priceOffer}
                          onChange={(e) => setFieldValue(`lineItems.${idx}.priceOffer`, e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 placeholder-stone-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-colors"
                        />
                      </div>

                      {/* Döviz */}
                      <div className="flex gap-1">
                        {CURRENCIES.map((cur) => (
                          <button
                            key={cur}
                            type="button"
                            onClick={() => setFieldValue(`lineItems.${idx}.currency`, cur)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                              item.currency === cur
                                ? "bg-blue-600 border-blue-500 text-white"
                                : "bg-stone-800 border-stone-700 text-stone-500 hover:text-stone-300"
                            }`}
                          >
                            {cur}
                          </button>
                        ))}
                      </div>

                      {/* Adet */}
                      <div>
                        <label className="text-[10px] text-stone-500 font-bold uppercase mb-1.5 block">Adet</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => setFieldValue(`lineItems.${idx}.quantity`, e.target.value)}
                          placeholder="1"
                          className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 placeholder-stone-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Row 3: Notes */}
                    <div className="border-t border-stone-600 pt-3">
                      <FormikControl control="input" type="text" label="" name={`lineItems.${idx}.notes`} placeholder="Not (opsiyonel)" />
                    </div>
                  </div>

                  {/* Mobile: Stacked layout */}
                  <div className="sm:hidden space-y-2 p-4">
                    {/* Line: Number + Name + Delete */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="shrink-0 w-6 h-6 rounded-md bg-amber-500/20 border border-amber-600/30 flex items-center justify-center text-[10px] font-black text-amber-400">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <FormikControl control="input" type="text" label="" name={`lineItems.${idx}.title`} placeholder="Ürün / Hizmet Adı" />
                      </div>
                      {values.lineItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(idx)}
                          className="shrink-0 w-7 h-7 rounded-lg bg-stone-800 hover:bg-red-900/40 text-stone-400 hover:text-red-400 transition-colors flex items-center justify-center text-lg"
                        >
                          −
                        </button>
                      )}
                    </div>

                    {/* Price + Currency */}
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase mb-1.5 block">Fiyat</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.priceOffer}
                          onChange={(e) => setFieldValue(`lineItems.${idx}.priceOffer`, e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 placeholder-stone-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-colors"
                        />
                      </div>
                      <div className="flex gap-1">
                        {CURRENCIES.map((cur) => (
                          <button
                            key={cur}
                            type="button"
                            onClick={() => setFieldValue(`lineItems.${idx}.currency`, cur)}
                            className={`px-1.5 py-1.5 rounded text-[10px] font-bold border transition-colors ${
                              item.currency === cur
                                ? "bg-blue-600 border-blue-500 text-white"
                                : "bg-stone-800 border-stone-700 text-stone-500 hover:text-stone-300"
                            }`}
                          >
                            {cur}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="text-[10px] text-stone-500 font-bold uppercase mb-1.5 block">Adet</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => setFieldValue(`lineItems.${idx}.quantity`, e.target.value)}
                        placeholder="1"
                        className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 placeholder-stone-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-colors"
                      />
                    </div>

                    {/* Notes */}
                    <div className="border-t border-stone-600 pt-2">
                      <FormikControl control="input" type="text" label="" name={`lineItems.${idx}.notes`} placeholder="Not (opsiyonel)" />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => push({ title: "", priceOffer: "", currency: "EUR", quantity: 1, notes: "" })}
                className="w-full py-2 px-3 rounded-lg border border-dashed border-stone-600 text-sm font-semibold text-stone-400 hover:border-stone-500 hover:text-stone-300 transition-colors"
              >
                + Ürün/Hizmet Ekle
              </button>
              {touched.lineItems && typeof errors.lineItems === "string" && (
                <p className="text-xs text-red-400 mt-1">{errors.lineItems}</p>
              )}
            </>
          )}
        </FieldArray>
      </div>
    </div>
  );
}

function SettingsSection() {
  const { values, setFieldValue } = useFormikContext();

  return (
    <div className="rounded-xl border border-stone-700 overflow-hidden">
      <div className="px-4 py-2.5 bg-stone-900/70 border-b border-stone-700">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Ayarlar</p>
      </div>
      <div className="p-4 sm:p-5 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">Doküman Tipi</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DOC_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFieldValue("docType", type)}
                className={`py-2 px-2 rounded-lg border text-xs font-bold transition-colors ${
                  values.docType === type
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-stone-800 border-stone-600 text-stone-400 hover:border-stone-500"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <FormikControl control="input" type="number" label="KDV (%)" name="vatRate" />
          </div>

          <div className="flex items-center gap-2 sm:pt-5">
            <input
              type="checkbox"
              id="showVat"
              checked={values.showVat}
              onChange={(e) => setFieldValue("showVat", e.target.checked)}
              className="w-4 h-4 rounded border-stone-600 cursor-pointer"
            />
            <label htmlFor="showVat" className="text-sm text-stone-300 cursor-pointer">
              KDV'yi Göster
            </label>
          </div>

          <div className="flex items-center gap-2 sm:pt-5">
            <input
              type="checkbox"
              id="showTotals"
              checked={values.showTotals}
              onChange={(e) => setFieldValue("showTotals", e.target.checked)}
              className="w-4 h-4 rounded border-stone-600 cursor-pointer"
            />
            <label htmlFor="showTotals" className="text-sm text-stone-300 cursor-pointer">
              Toplamları Göster
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function TermsSection() {
  const { values, setFieldValue } = useFormikContext();
  const currentType = DOC_TYPE_MAP[values.docType] || 'offer';
  const terms = (values.offerTerms || []).filter(
    t => t.isEditable && t.isVisible && t.visibleIn?.includes(currentType)
  );
  if (!terms.length) return null;

  const update = (key, val) =>
    setFieldValue('offerTerms', values.offerTerms.map(t => t.key === key ? { ...t, value: val } : t));

  return (
    <div className="rounded-xl border border-stone-700 overflow-hidden">
      <div className="px-4 py-2.5 bg-stone-900/70 border-b border-stone-700 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Satış Koşulları</p>
        <span className="text-[10px] text-stone-500 font-semibold">{terms.length} madde</span>
      </div>
      <div className="p-4 sm:p-5 space-y-3">
        {terms.map(term => (
          <div key={term.key}>
            <p className="text-xs font-semibold text-stone-400 mb-1.5">{term.label}</p>
            {term.options?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {term.options.map(opt => (
                  <button key={opt} type="button"
                    onClick={() => update(term.key, term.value ? `${term.value}, ${opt}` : opt)}
                    className="px-2.5 py-1 text-xs rounded-lg border bg-stone-900 border-stone-600 text-stone-400 hover:border-stone-400 hover:text-stone-200 transition-colors">
                    + {opt}
                  </button>
                ))}
              </div>
            )}
            <textarea rows={2} value={term.value ?? ""} onChange={e => update(term.key, e.target.value)}
              placeholder="Koşul metnini girin..."
              className="w-full px-3 py-2 text-sm bg-stone-900 border border-stone-600 rounded-xl text-stone-200 placeholder-stone-600 focus:outline-none focus:border-stone-400 resize-none" />
          </div>
        ))}
        <p className="text-[10px] text-stone-600">Sabit metinler (garanti, servis vb.) firma ayarlarından otomatik eklenir.</p>
      </div>
    </div>
  );
}

export default function SimpleOfferForm() {
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [initialValues, setInitialValues] = useState(DEFAULT_VALUES);

  useEffect(() => {
    axiosOrg.get("/me")
      .then(({ data }) => {
        if (data.offerDefaults) {
          setInitialValues((prev) => ({
            ...prev,
            offerTerms: data.offerDefaults,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setMessage(null);
    try {
      const { data } = await axios.post("/api/offer/quick", values);
      if (data.success) {
        setMessage({ text: data.message || "Teklif oluşturuldu.", type: "success" });
        setTimeout(() => router.push("/shield/offer"), 1500);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Hata oluştu",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values }) => (
          <Form className="space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-400 hover:text-stone-200 transition-colors"
              >
                ←
              </button>
              <div>
                <h1 className="text-2xl font-black text-stone-100">Hızlı Teklif</h1>
                <p className="text-sm text-stone-500 mt-0.5">Serbest kalem teklif oluşturun</p>
              </div>
            </div>

            <CompanySearch />
            <ContactFields />
            <LineItemsSection />
            <SettingsSection />
            <TermsSection />

            {message && <MessageBlock message={message} />}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-12 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 border border-amber-500 text-sm font-bold text-white transition-colors"
              >
                {isSubmitting ? "Oluşturuluyor..." : "Teklif Oluştur"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
