"use client";
import { useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { Bebas_Neue, Inter } from "next/font/google";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], display: "swap" });
const inter = Inter({ subsets: ["latin"], display: "swap" });

/* ─── animated gradient canvas shader ─── */
function ShaderBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let t = 0;

    const orbs = [
      { x: 0.15, y: 0.25, r: 0.55, col: "180,90,20",  spd: 0.00035, ax: 0.18, ay: 0.12 },
      { x: 0.75, y: 0.60, r: 0.50, col: "220,140,30",  spd: 0.00028, ax: 0.14, ay: 0.20 },
      { x: 0.50, y: 0.80, r: 0.45, col: "100,60,10",   spd: 0.00045, ax: 0.22, ay: 0.10 },
      { x: 0.85, y: 0.15, r: 0.38, col: "240,180,60",  spd: 0.00020, ax: 0.10, ay: 0.16 },
      { x: 0.30, y: 0.70, r: 0.30, col: "60,40,8",     spd: 0.00060, ax: 0.08, ay: 0.22 },
    ];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      t += 1;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#050402";
      ctx.fillRect(0, 0, W, H);

      for (const o of orbs) {
        const cx = (o.x + Math.sin(t * o.spd + o.ax) * o.ax) * W;
        const cy = (o.y + Math.cos(t * o.spd + o.ay) * o.ay) * H;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, o.r * Math.max(W, H));
        grad.addColorStop(0,   `rgba(${o.col},0.22)`);
        grad.addColorStop(0.5, `rgba(${o.col},0.06)`);
        grad.addColorStop(1,   `rgba(${o.col},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return (
    <canvas ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ filter: "blur(40px)", mixBlendMode: "screen" }} />
  );
}

/* ─── grain overlay ─── */
function Grain() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: 0.04,
        backgroundSize: "180px",
      }} />
  );
}

/* ─── feature card ─── */
function Card({ icon, title, desc, accent = false, large = false, tall = false }) {
  const base = `relative rounded-2xl border bg-stone-950/70 backdrop-blur-sm p-6 flex flex-col gap-3 overflow-hidden
    ${accent ? "border-amber-700/60 bg-amber-950/30" : "border-stone-800"}
    ${large ? "md:col-span-2" : ""}
    ${tall  ? "md:row-span-2" : ""}`;
  return (
    <div className={base}>
      {accent && <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-transparent pointer-events-none" />}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent ? "bg-amber-900/50 border border-amber-700/50" : "bg-stone-800 border border-stone-700"}`}>
        {icon}
      </div>
      <div>
        <h3 className={`font-bold leading-snug ${large ? "text-xl" : "text-base"} ${accent ? "text-amber-200" : "text-stone-100"}`}>{title}</h3>
        <p className={`mt-1 leading-relaxed ${large ? "text-sm" : "text-xs"} ${accent ? "text-amber-300/70" : "text-stone-500"}`}>{desc}</p>
      </div>
    </div>
  );
}

/* ─── step ─── */
function Step({ n, title, desc }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="shrink-0 w-10 h-10 rounded-full border border-amber-600/60 bg-amber-900/20 flex items-center justify-center">
        <span className="text-sm font-black text-amber-400">{n}</span>
      </div>
      <div>
        <p className="text-sm font-bold text-stone-200">{title}</p>
        <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();

  return (
    <div className={`${inter.className} bg-[#050402] text-white overflow-x-hidden`}>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 overflow-hidden">
        <ShaderBg />
        <Grain />

        {/* grid lines */}
        <div className="pointer-events-none absolute inset-0 z-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />

        {/* badge */}
        <div className="relative z-20 mb-6 flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-700/50 bg-amber-950/40 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-semibold text-amber-400 tracking-widest uppercase">Makine Satışı için Tasarlandı</span>
        </div>

        {/* headline */}
        <h1 className={`${bebas.className} relative z-20 text-center leading-none tracking-wide`}
          style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)" }}>
          <span className="text-stone-100">TEKLİF VER,</span>
          <br />
          <span className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #f59e0b 0%, #fcd34d 40%, #d97706 100%)" }}>
            SATIŞ KAPAT.
          </span>
        </h1>

        <p className="relative z-20 mt-6 max-w-xl text-center text-stone-400 leading-relaxed"
          style={{ fontSize: "clamp(0.9rem, 2vw, 1.1rem)" }}>
          Makine üreticileri ve distribütörleri için geliştirilmiş teklif yönetimi.
          Ürün kataloğunuzdan saniyeler içinde profesyonel teklifler oluşturun.
        </p>

        <div className="relative z-20 mt-10 flex items-center gap-3 flex-wrap justify-center">
          <Link href={user ? "/shield/profile" : "/auth"}>
            <button className="px-7 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all"
              style={{ background: "linear-gradient(135deg, #b45309, #d97706)", boxShadow: "0 0 30px rgba(217,119,6,0.4)" }}>
              {user ? "Dashboard'a Git" : "Hemen Başla"}
            </button>
          </Link>
          <Link href="/auth">
            <button className="px-7 py-3 rounded-xl font-semibold text-sm border border-stone-700 bg-stone-900/60 text-stone-300 hover:border-stone-500 hover:text-white transition-all cursor-pointer backdrop-blur-sm">
              Demo İncele
            </button>
          </Link>
        </div>

        {/* scroll hint */}
        <div className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <span className="text-[10px] tracking-widest uppercase text-stone-500">Keşfet</span>
          <svg className="w-4 h-4 text-stone-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="border-y border-stone-800/60 bg-stone-950/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { n: "∞",    label: "Teklif Limiti Yok" },
            { n: "4",    label: "Belge Tipi" },
            { n: "PDF",  label: "Anında Çıktı" },
            { n: "₺€$",  label: "Çoklu Para Birimi" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className={`${bebas.className} text-4xl text-amber-400`}>{s.n}</span>
              <span className="text-xs text-stone-500 uppercase tracking-widest text-center">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ FEATURES BENTO ═══════════════ */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">Özellikler</p>
          <h2 className={`${bebas.className} text-5xl md:text-6xl text-stone-100`}>Her Şey Tek Yerde</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          {/* large card */}
          <Card large accent
            icon={<svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>}
            title="Akıllı Teklif Yönetimi"
            desc="Teklif, Proforma, Fatura ve Sipariş tiplerini tek platformda yönetin. Her belgenin versiyon geçmişini kayıt altına alın, müşteriye özel fiyat politikaları uygulayın." />

          <Card
            icon={<svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></svg>}
            title="Ürün & Varyant Kataloğu"
            desc="Model aileleri, varyantlar ve teknik spesifikasyonlar. Bir kez tanımlayın, her teklifte kullanın." />

          <Card
            icon={<svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>}
            title="Opsiyon Yönetimi"
            desc="Makine aksesuarlarını ve opsiyonlarını katalogda tanımlayın. Teklife eklenince fiyat otomatik hesaplansın." />

          <Card
            icon={<svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" /></svg>}
            title="Firma & Kişi Yönetimi"
            desc="Müşteri firmaları, bayi ağınız ve teknik satış temsilcilerinizi merkezi kayıtta tutun." />

          <Card large accent
            icon={<svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>}
            title="PDF Çıktısı — Tek Tıkla"
            desc="Kurumsal şablonlarla hazırlanmış profesyonel tekliflerinizi saniyeler içinde PDF olarak indirin veya müşterinize gönderin. Marka kimliğinize uygun çıktılar." />

          <Card
            icon={<svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
            title="Çoklu Para Birimi"
            desc="TL, EUR ve USD ile eş zamanlı fiyatlama. KDV hesaplama ve iskonto yönetimi dahil." />

        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="border-t border-stone-800/60">
        <div className="max-w-5xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">Nasıl Çalışır?</p>
            <h2 className={`${bebas.className} text-5xl text-stone-100 leading-tight mb-8`}>
              3 ADIMDA<br/>PROFESYONEL<br/>TEKLİF
            </h2>
            <div className="space-y-6">
              <Step n="01" title="Kataloğunuzu Kurun"
                desc="Ürün ailelerinizi, model varyantlarını ve opsiyonları bir kez sisteme tanımlayın. Teknik spesifikasyonlar, liste fiyatları ve net fiyatlar kayıt altında." />
              <Step n="02" title="Teklif Oluşturun"
                desc="Müşteri seçin, ürünleri katalogdan ekleyin, opsiyonları işaretleyin. Fiyatlar ve toplamlar otomatik hesaplanır." />
              <Step n="03" title="PDF'e Aktarın"
                desc="Tek tıkla kurumsal PDF oluşturun. Müşterinize anında iletin, versiyon geçmişi sistemde saklansın." />
            </div>
          </div>

          {/* decorative panel */}
          <div className="relative rounded-2xl border border-stone-800 bg-stone-950/60 p-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(217,119,6,0.15) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
            <div className="space-y-3 relative z-10">
              {[
                { label: "Teklif #TK-2024-089", type: "Teklif",   color: "text-amber-400",   dot: "bg-amber-400" },
                { label: "Proforma #PF-2024-034", type: "Proforma", color: "text-blue-400",    dot: "bg-blue-400" },
                { label: "Fatura #FT-2024-021",   type: "Fatura",   color: "text-emerald-400", dot: "bg-emerald-400" },
                { label: "Sipariş #SP-2024-012",  type: "Sipariş",  color: "text-violet-400",  dot: "bg-violet-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-stone-900/60 border border-stone-800">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                    <span className="text-xs font-mono text-stone-300">{item.label}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${item.color}`}>{item.type}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-stone-800 flex items-center justify-between">
                <span className="text-xs text-stone-500">Toplam ciro</span>
                <span className="text-lg font-black text-amber-400 tabular-nums">€ 248.500</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="relative overflow-hidden border-t border-stone-800/60">
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(180,83,9,0.18) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-24 text-center">
          <h2 className={`${bebas.className} text-5xl md:text-7xl text-stone-100 mb-4`}>
            SATIŞA HAZIR<br/>
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg, #f59e0b, #fcd34d, #d97706)" }}>
              MISINIZ?
            </span>
          </h2>
          <p className="text-stone-400 mb-10 max-w-lg mx-auto text-sm leading-relaxed">
            Makine satış ekibinizin verimliliğini artırın. İlk teklifinizi 5 dakikada oluşturun.
          </p>
          <Link href={user ? "/shield/profile" : "/auth"}>
            <button className="px-10 py-4 rounded-xl font-black text-base cursor-pointer transition-all"
              style={{ background: "linear-gradient(135deg, #b45309, #d97706)", boxShadow: "0 0 60px rgba(217,119,6,0.3)" }}>
              {user ? "Dashboard'a Git →" : "Ücretsiz Başla →"}
            </button>
          </Link>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-stone-800/40 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className={`${bebas.className} text-2xl text-stone-400 tracking-widest`}>POSTIVA</span>
          <p className="text-xs text-stone-600">© {new Date().getFullYear()} Postiva — Makine Satışı için Teklif Platformu</p>
        </div>
      </footer>

    </div>
  );
}
