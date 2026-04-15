"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "@/components/formik/FormikControl";
import FormSaveButton from "@/components/formSaveButton";
import MessageBlock from "@/components/messageBlock";
import axios from "@/utils/axios";
import { useAuth } from "@/context/AuthContext";

const initialValues = {
  title: "",
  makeId: "",
  currency: "EUR",
  description: "",
};

const validationSchema = Yup.object({
  title: Yup.string().trim().required("Liste adı zorunlu"),
  makeId: Yup.string().required("Marka seçimi zorunlu"),
  currency: Yup.string().required("Döviz zorunlu"),
});

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-stone-700 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-stone-700 bg-stone-900/60">
        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{title}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function PriceListForm() {
  const router = useRouter();
  const { user } = useAuth();
  const isSuperAdmin = user?.roles?.includes("superadmin");
  const [makes, setMakes] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!isSuperAdmin) return;

    axios.get("/api/make")
      .then(({ data }) => {
        if (data.success) {
          setMakes(data.makes.map((m) => ({ value: m._id, label: m.name, logo: m.logo })));
        }
      })
      .catch(() => {});
  }, [isSuperAdmin]);

  if (!isSuperAdmin) {
    return <div className="p-8 text-stone-400">Bu sayfaya erişim yetkiniz yok.</div>;
  }

  return (
    <div className="text-white max-w-4xl mx-auto px-2 sm:px-4 py-4">
      <div className="flex items-center gap-3 px-4 py-4">
        <button
          onClick={() => router.push("/shield/price-list")}
          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-400 hover:text-stone-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-black text-stone-100 flex-1">Yeni Fiyat Listesi</h1>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setMessage(null);
          try {
            const payload = {
              ...values,
              title: values.title.trim(),
            };
            const { data } = await axios.post("/api/price-list", payload);
            if (data.success) {
              setMessage({ text: "Fiyat listesi oluşturuldu", type: "success" });
              router.push(`/shield/price-list/${data.record._id}`);
            }
          } catch (error) {
            setMessage({ text: error.response?.data?.message || "Fiyat listesi oluşturulamadı.", type: "error" });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, submitCount, setFieldValue, setFieldTouched, isSubmitting }) => (
          <Form className="space-y-3" autoComplete="off">
            <Section title="Temel Bilgiler">
              <div className="space-y-3">
                <FormikControl control="input" type="text" label="Liste Adı *" name="title" />
              </div>
            </Section>

            <Section title="Marka Seçimi">
              {(touched.makeId || submitCount > 0) && errors.makeId && (
                <p className="text-xs text-red-400 mb-3">{errors.makeId}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {makes.map((mk) => (
                  <button
                    key={mk.value}
                    type="button"
                    onClick={() => {
                      setFieldValue("makeId", mk.value);
                      setFieldTouched("makeId", true, false);
                    }}
                    className={`group flex flex-col items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                      values.makeId === mk.value
                        ? "bg-amber-600/10 border-amber-500 shadow-[0_0_0_1px_rgba(217,119,6,0.4)]"
                        : "bg-stone-800/60 border-stone-600 hover:border-stone-400"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      {mk.logo ? (
                        <img src={mk.logo} alt={mk.label} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-stone-700/60">
                          <span className="text-sm font-bold text-stone-400">{mk.label?.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-center text-stone-200">{mk.label}</span>
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Döviz">
              {(touched.currency || submitCount > 0) && errors.currency && (
                <p className="text-xs text-red-400 mb-3">{errors.currency}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {["EUR", "USD", "TRY", "GBP", "CHF"].map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => {
                      setFieldValue("currency", cur);
                      setFieldTouched("currency", true, false);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                      values.currency === cur
                        ? "bg-amber-600 border-amber-500 text-white"
                        : "bg-stone-800 border-stone-600 text-stone-300 hover:border-amber-500"
                    }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Açıklama">
              <FormikControl control="textArea" label="Açıklama" name="description" />
            </Section>

            <div className="px-4 sm:px-0 mt-4 space-y-2">
              <MessageBlock message={message} />
              <FormSaveButton isSubmitting={isSubmitting} />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
