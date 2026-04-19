"use client";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";
import ContactFields from "@/components/company/ContactFields";
import MessageBlock from "@/components/messageBlock";
import CompanySearch from "./simple/CompanySearch";
import LineItemsSection from "./simple/LineItemsSection";
import SettingsSection from "./simple/SettingsSection";
import TermsSection from "./simple/TermsSection";
import { validationSchema, DEFAULT_VALUES } from "./simple/constants";

export default function SimpleOfferEditForm({ offerId }) {
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/offer/${offerId}`)
      .then(({ data }) => {
        const record = data.record;
        const co = record.company || {};
        const addr = co.addresses?.[0] || {};
        const lastVersion = record.versions[record.versions.length - 1];
        const contact = record.contact || {};

        setInitialValues({
          ...DEFAULT_VALUES,
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
          contactId: contact._id || "",
          contactName: contact.name || "",
          contactPhone: contact.phones?.[0] || "",
          contactEmail: contact.emails?.[0] || "",
          docType: lastVersion.docType || "Teklif",
          vatRate: lastVersion.vatRate ?? 20,
          showVat: lastVersion.showVat ?? true,
          showTotals: lastVersion.showTotals ?? true,
          lineItems: (lastVersion.lineItems || []).map((item) => ({
            title: item.title || "",
            priceOffer: item.priceOffer || "",
            currency: item.currency || "EUR",
            quantity: item.quantity || 1,
            notes: item.notes || "",
          })),
          offerTerms: lastVersion.offerTerms || [],
        });
      })
      .catch(() => {
        setMessage({ type: "error", text: "Teklif yüklenemedi." });
      })
      .finally(() => setLoading(false));
  }, [offerId]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setMessage(null);
    try {
      const { data } = await axios.patch(`/api/offer/${offerId}/quick`, values);
      if (data.success) {
        setMessage({ text: data.message || "Teklif güncellendi.", type: "success" });
        setTimeout(() => router.push("/shield/offer"), 1500);
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Hata oluştu" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-center min-h-64">
        <p className="text-stone-500 text-sm">Yükleniyor...</p>
      </div>
    );
  }

  if (!initialValues) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {message && <MessageBlock message={message} />}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <button type="button" onClick={() => router.back()}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-400 hover:text-stone-200 transition-colors">
                ←
              </button>
              <div>
                <h1 className="text-2xl font-black text-stone-100">Teklif Düzenle</h1>
                <p className="text-sm text-stone-500 mt-0.5">Serbest kalem teklifi güncelle</p>
              </div>
            </div>

            <CompanySearch />
            <ContactFields />
            <LineItemsSection />
            <SettingsSection />
            <TermsSection />

            {message && <MessageBlock message={message} />}

            <div className="flex justify-end pt-2">
              <button type="submit" disabled={isSubmitting}
                className="py-2.5 px-12 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 border border-blue-500 text-sm font-bold text-white transition-colors">
                {isSubmitting ? "Güncelleniyor..." : "Teklif Güncelle"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
