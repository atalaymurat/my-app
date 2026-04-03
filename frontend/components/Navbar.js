"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], display: "swap" });

export default function Navbar() {
  const { user, loading, signOut, authChecked } = useAuth();
  const router = useRouter();

  if (loading && !authChecked) {
    return (
      <nav className="h-16 border-b border-stone-800/60 bg-[#050402]/90 backdrop-blur-md px-5 flex items-center justify-between">
        <span className={`${bebas.className} text-2xl tracking-widest text-stone-200`}>POSTIVA</span>
        <div className="w-4 h-4 border-t-2 border-amber-500 rounded-full animate-spin" />
      </nav>
    );
  }

  return (
    <nav className="h-16 border-b border-stone-800/60 bg-[#050402]/90 backdrop-blur-md px-5 flex items-center justify-between sticky top-0 z-50">

      {/* Logo */}
      <span
        className={`${bebas.className} text-2xl tracking-widest text-stone-100 hover:text-amber-400 transition-colors cursor-pointer select-none`}
        onClick={() => router.push("/")}
      >
        POSTIVA
      </span>

      {/* Right side */}
      {user && !loading ? (
        <div className="flex items-center gap-3">
          {/* Profile link */}
          <Link href="/shield/profile">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-stone-800 bg-stone-900/60 hover:border-stone-600 hover:bg-stone-800/60 transition-all cursor-pointer">
              {user?.profilePicture ? (
                <Image
                  src={user.profilePicture}
                  width={26} height={26}
                  alt={user.name}
                  priority
                  quality={75}
                  className="rounded-full ring-1 ring-amber-600/40"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-amber-900/50 border border-amber-700/50 flex items-center justify-center">
                  <span className="text-xs font-bold text-amber-400">
                    {(user?.name || user?.email || "?")[0].toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-xs font-semibold text-stone-300 max-w-[100px] truncate hidden sm:block">
                {user?.name || user?.email}
              </span>
            </div>
          </Link>

          {/* Sign out */}
          <button
            onClick={signOut}
            title="Çıkış Yap"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-800 bg-stone-900/60 text-stone-500 hover:border-red-800/60 hover:bg-red-950/30 hover:text-red-400 transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
            </svg>
          </button>
        </div>
      ) : (
        !loading && (
          <button
            onClick={() => router.push("/auth")}
            className="px-4 py-2 rounded-lg text-xs font-bold border border-amber-700/60 bg-amber-900/20 text-amber-400 hover:bg-amber-900/40 hover:border-amber-600 transition-all cursor-pointer"
          >
            Giriş Yap
          </button>
        )
      )}
    </nav>
  );
}
