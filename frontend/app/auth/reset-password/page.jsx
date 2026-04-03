"use client";
import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], display: "swap" });

const schema = Yup.object({
  email: Yup.string().email("Geçersiz e-posta").required("E-posta zorunlu"),
});

export default function ResetPassword() {
  const [sent, setSent] = useState(false);
  const [authError, setAuthError] = useState("");
  const router = useRouter();

  const handleReset = async (values) => {
    try {
      await sendPasswordResetEmail(auth, values.email);
      setSent(true);
      setAuthError("");
      setTimeout(() => router.push("/auth"), 4000);
    } catch {
      setAuthError("Sıfırlama e-postası gönderilemedi. Lütfen tekrar deneyin.");
      setSent(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050402] flex items-center justify-center px-4 relative overflow-hidden">

      {/* bg glow */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(180,83,9,0.10) 0%, transparent 70%)" }} />

      {/* grid */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

      <div className="relative z-10 w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className={`${bebas.className} text-4xl tracking-widest text-stone-100`}>POSTIVA</span>
          <p className="text-xs text-stone-500 mt-1">Parola Sıfırlama</p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-950/80 backdrop-blur-sm p-7 space-y-5">

          {sent ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-900/40 border border-emerald-700/50 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-200">E-posta gönderildi</p>
                <p className="text-xs text-stone-500 mt-1">Gelen kutunuzu kontrol edin. Birkaç saniye içinde yönlendirileceksiniz.</p>
              </div>
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm font-semibold text-stone-200">Parolanızı mı unuttunuz?</p>
                <p className="text-xs text-stone-500 mt-1">E-posta adresinizi girin, sıfırlama bağlantısı gönderelim.</p>
              </div>

              {authError && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-950/40 border border-red-800/50">
                  <svg className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126Z" />
                  </svg>
                  <p className="text-xs text-red-400">{authError}</p>
                </div>
              )}

              <Formik initialValues={{ email: "" }} validationSchema={schema} onSubmit={handleReset}>
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-400 uppercase tracking-widest">E-posta</label>
                      <Field name="email" type="email" placeholder="ornek@firma.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
                      <ErrorMessage name="email" component="p" className="text-xs text-red-400" />
                    </div>

                    <button type="submit" disabled={isSubmitting}
                      className="w-full py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: "linear-gradient(135deg, #b45309, #d97706)" }}>
                      {isSubmitting
                        ? <span className="flex items-center justify-center gap-2"><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>Gönderiliyor...</span>
                        : "Sıfırlama Bağlantısı Gönder"
                      }
                    </button>
                  </Form>
                )}
              </Formik>
            </>
          )}

          <div className="pt-1 text-center">
            <button onClick={() => router.push("/auth")}
              className="text-xs text-stone-500 hover:text-amber-400 transition-colors cursor-pointer">
              ← Giriş sayfasına dön
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
