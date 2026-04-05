"use client";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "@/utils/axios";
import ProgressBar from "./wizard/ProgressBar";
import StepCompany from "./wizard/StepCompany";
import StepProducts from "./wizard/StepProducts";
import StepConditions from "./wizard/StepConditions";
import StepSummary from "./wizard/StepSummary";

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
    .min(1, "En az bir ürün/hizmet eklemelisiniz")
    .of(Yup.object({ title: Yup.string().trim().required("Ürün adı zorunludur") })),
});

const DEFAULT_VALUES = {
  docType: "Teklif", search: "", companyId: "", contactId: "", contactName: "",
  contactPhone: "", contactEmail: "", title: "", vatTitle: "", email: "", domain: "",
  line1: "", line2: "", district: "", city: "", country: "",
  lineItems: [{
    title: "", priceList: "", priceOffer: "", priceNet: "", currency: "",
    productValue: "", condition: "", image: "", caption: "", notes: "",
    quantity: 1, options: [], selectedOptions: [], selectedMakeId: "", selectedVariantId: "",
  }],
  vatRate: 20, showVat: true, showTotals: true,
};

function mapOfferToForm(offer) {
  const lastVersion = offer.versions[offer.versions.length - 1];
  const co = offer.company || {};
  const addr = co.addresses?.[0] || {};
  return {
    _id: offer._id, docType: offer.docType || "Teklif", search: "",
    companyId: co._id || "", title: co.title || "", vatTitle: co.vatTitle || "",
    email: co.emails?.[0] || "", domain: co.domains?.[0] || "",
    line1: addr.line1 || "", line2: addr.line2 || "",
    district: addr.district || "", city: addr.city || "", country: addr.country || "",
    contactId: offer.contact?._id || "", contactName: offer.contact?.name || "",
    contactPhone: offer.contact?.phones?.[0] || "", contactEmail: offer.contact?.emails?.[0] || "",
    vatRate: lastVersion?.vatRate ?? 20, showVat: lastVersion?.showVat ?? true,
    showTotals: lastVersion?.showTotals ?? true,
    lineItems: (lastVersion?.lineItems || []).map((item) => ({
      title: item.title || "", productValue: item.productValue || "",
      selectedMakeId: "", selectedVariantId: item.variantId || "",
      options: [],
      selectedOptions: (item.selectedOptions || []).map((o) => ({
        value: o.optionId, label: o.label || o.title || "",
        listPrice: o.listPrice, offerPrice: o.offerPrice, netPrice: o.netPrice,
        currency: o.currency, desc: o.desc, quantity: o.quantity,
      })),
      priceList: item.priceList || "", priceOffer: item.priceOffer || "",
      priceNet: item.priceNet || "", variantPriceList: item.priceList || 0,
      variantPriceOffer: item.priceOffer || 0, variantPriceNet: item.priceNet || 0,
      currency: item.currency || "", quantity: item.quantity || 1,
      notes: item.notes || "", condition: item.condition || "",
      image: item.image || "", caption: item.caption || "",
    })),
  };
}

export default function NewForm({ offerId }) {
  const [message, setMessage] = useState(null);
  const [initialValues, setInitialValues] = useState(DEFAULT_VALUES);
  const [loading, setLoading] = useState(!!offerId);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!offerId) return;
    (async () => {
      try {
        const { data } = await axios.get(`/api/offer/${offerId}`);
        if (data.success) setInitialValues(mapOfferToForm(data.record));
      } catch { setMessage({ type: "error", text: "Teklif yüklenemedi." }); }
      finally { setLoading(false); }
    })();
  }, [offerId]);

  if (loading) return <div className="text-stone-400 py-12 text-center text-sm">Yükleniyor...</div>;

  const validateStep1 = async (validateForm, setTouched, values) => {
    if (values.companyId) return true;
    await setTouched({ title: true, city: true, country: true }, false);
    const errors = await validateForm();
    return !errors.title && !errors.city && !errors.country;
  };

  return (
    <Formik
      enableReinitialize initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        try {
          const { data } = await axios.post("/api/offer", values);
          if (data.success) {
            setMessage({ text: data.message || "Başarıyla Kaydedildi", type: "success" });
          }
        } catch (err) {
          setMessage({ type: "error", text: err.response?.data?.message || "Hata oluştu" });
        } finally { setSubmitting(false); }
      }}
    >
      {({ isSubmitting, values, validateForm, setTouched }) => (
        <Form autoComplete="off" className="space-y-2">
          <ProgressBar currentStep={currentStep} />

          <div className="flex flex-col min-h-[60vh]">
            {currentStep === 0 && (
              <>
                <StepCompany />
                <button type="button"
                  onClick={async () => {
                    const ok = await validateStep1(validateForm, setTouched, values);
                    if (ok) setCurrentStep(1);
                  }}
                  className="mt-auto py-3 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-500 text-sm font-bold text-white transition-colors shadow-lg shadow-blue-900/20">
                  Ürünlere Geç →
                </button>
              </>
            )}

            {currentStep === 1 && (
              <StepProducts
                onPrev={() => setCurrentStep(0)}
                onNext={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && (
              <StepConditions
                onPrev={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 3 && (
              <StepSummary
                onPrev={() => setCurrentStep(2)}
                message={message}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
}
