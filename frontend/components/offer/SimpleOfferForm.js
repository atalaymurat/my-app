"use client";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import axios from "@/utils/axios";
import axiosOrg from "@/utils/axiosOrg";
import { useRouter } from "next/navigation";
import ContactFields from "@/components/company/ContactFields";
import MessageBlock from "@/components/messageBlock";
import CompanySearch from "./simple/CompanySearch";
import LineItemsSection from "./simple/LineItemsSection";
import SettingsSection from "./simple/SettingsSection";
import TermsSection from "./simple/TermsSection";
import { validationSchema, DEFAULT_VALUES } from "./simple/constants";

export default function SimpleOfferForm() {
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [initialValues, setInitialValues] = useState(DEFAULT_VALUES);

  useEffect(() => {
    axiosOrg.get("/me")
      .then(({ data }) => {
        if (data.offerDefaults) {
          setInitialValues((prev) => ({ ...prev, offerTerms: data.offerDefaults }));
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
      setMessage({ type: "error", text: err.response?.data?.message || "Hata oluştu" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <button type="button" onClick={() => router.back()}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-400 hover:text-stone-200 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
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
              <button type="submit" disabled={isSubmitting}
                className="py-3 px-8 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 border border-amber-500 text-sm font-bold text-white transition-colors">
                {isSubmitting ? "Oluşturuluyor..." : "Teklif Oluştur"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
