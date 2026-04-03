"use client";
import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import GoogleAuth from "../../components/GoogleAuth";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], display: "swap" });

const ERROR_MAP = {
  "auth/user-not-found":       "Bu e-posta ile kayıtlı kullanıcı bulunamadı.",
  "auth/wrong-password":       "Parola hatalı.",
  "auth/email-already-in-use": "Bu e-posta zaten kayıtlı. Giriş yapın.",
  "auth/invalid-email":        "Geçersiz e-posta formatı.",
  "auth/invalid-credential":   "E-posta veya parola hatalı.",
};

const schema = Yup.object({
  email:    Yup.string().email("Geçersiz e-posta").required("E-posta zorunlu"),
  password: Yup.string().min(6, "En az 6 karakter").required("Parola zorunlu"),
});

function InputField({ name, type, placeholder, label }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-stone-400 uppercase tracking-widest">{label}</label>
      <Field name={name} type={type} placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-600 focus:bg-stone-900 transition-colors" />
      <ErrorMessage name={name} component="p" className="text-xs text-red-400 mt-0.5" />
    </div>
  );
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [authError, setAuthError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleAuth = async (values) => {
    setAuthError("");
    try {
      const credential = isLogin
        ? await signInWithEmailAndPassword(auth, values.email, values.password)
        : await createUserWithEmailAndPassword(auth, values.email, values.password);
      const idToken = await credential.user.getIdToken();
      const success = await login(idToken);
      if (success) router.push("/");
      else throw new Error("Login failed");
    } catch (err) {
      setAuthError(ERROR_MAP[err.code] || err.message || "Beklenmeyen bir hata oluştu.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050402] flex items-center justify-center px-4 relative overflow-hidden">

      {/* bg glow */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(180,83,9,0.12) 0%, transparent 70%)" }} />

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
          <p className="text-xs text-stone-500 mt-1">Makine Satışı için Teklif Platformu</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-stone-800 bg-stone-950/80 backdrop-blur-sm p-7 space-y-5">

          {/* Tab toggle */}
          <div className="flex rounded-xl overflow-hidden border border-stone-800 bg-stone-900/60 p-1 gap-1">
            {["Giriş Yap", "Kayıt Ol"].map((label, i) => {
              const active = isLogin === (i === 0);
              return (
                <button key={label} type="button" onClick={() => { setIsLogin(i === 0); setAuthError(""); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    active ? "bg-amber-600 text-white shadow-sm" : "text-stone-500 hover:text-stone-300"
                  }`}>
                  {label}
                </button>
              );
            })}
          </div>

          {/* Error */}
          {authError && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-950/40 border border-red-800/50">
              <svg className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126Z" />
              </svg>
              <p className="text-xs text-red-400">{authError}</p>
            </div>
          )}

          {/* Form */}
          <Formik initialValues={{ email: "", password: "" }} validationSchema={schema} onSubmit={handleAuth}>
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <InputField name="email"    type="email"    label="E-posta"  placeholder="ornek@firma.com" />
                <InputField name="password" type="password" label="Parola"   placeholder="••••••••" />

                {isLogin && (
                  <div className="text-right -mt-2">
                    <Link href="/auth/reset-password" className="text-xs text-stone-500 hover:text-amber-400 transition-colors">
                      Parolamı unuttum
                    </Link>
                  </div>
                )}

                <button type="submit" disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #b45309, #d97706)" }}>
                  {isSubmitting
                    ? <span className="flex items-center justify-center gap-2"><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>Lütfen bekleyin...</span>
                    : isLogin ? "Giriş Yap" : "Hesap Oluştur"
                  }
                </button>
              </Form>
            )}
          </Formik>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-800" />
            <span className="text-[10px] text-stone-600 uppercase tracking-widest">veya</span>
            <div className="flex-1 h-px bg-stone-800" />
          </div>

          {/* Google */}
          <GoogleAuth setAuthError={setAuthError} />

        </div>
      </div>
    </div>
  );
}
