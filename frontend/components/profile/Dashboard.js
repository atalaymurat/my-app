"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios";
import { useAuth } from "@/context/AuthContext";

/* ── tiny bar chart (pure SVG) ── */
function BarChart({ bars }) {
  const max = Math.max(...bars.map((b) => b.value), 1);
  const W = 128,
    H = 40,
    gap = 5;
  const bw = (W - gap * (bars.length - 1)) / bars.length;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="overflow-visible"
    >
      {bars.map((b, i) => {
        const bh = Math.max(3, (b.value / max) * H);
        return (
          <g key={i}>
            <rect
              x={i * (bw + gap)}
              y={H - bh}
              width={bw}
              height={bh}
              rx={2}
              fill={b.color}
              opacity={b.value === 0 ? 0.2 : 0.85}
            />
            {b.value > 0 && (
              <text
                x={i * (bw + gap) + bw / 2}
                y={H - bh - 4}
                textAnchor="middle"
                fontSize={8}
                fill={b.color}
                fontWeight="700"
              >
                {b.value}
              </text>
            )}
            <text
              x={i * (bw + gap) + bw / 2}
              y={H + 10}
              textAnchor="middle"
              fontSize={7}
              fill="#78716c"
            >
              {b.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── donut ring ── */
function Ring({ value, max, color, size = 60 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const pct = max > 0 ? value / max : 0;
  const dash = circ * pct;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#292524"
        strokeWidth={5}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
    </svg>
  );
}

/* ── stat pill ── */
function StatPill({ label, value, accent }) {
  const colors = {
    amber: "text-amber-400 bg-amber-900/30 border-amber-800/50",
    blue: "text-blue-400 bg-blue-900/30 border-blue-800/50",
    emerald: "text-emerald-400 bg-emerald-900/30 border-emerald-800/50",
    violet: "text-violet-400 bg-violet-900/30 border-violet-800/50",
    stone: "text-stone-300 bg-stone-800/60 border-stone-700",
  };
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-lg border ${colors[accent] || colors.stone}`}
    >
      <span className="text-xs font-bold uppercase tracking-widest opacity-70">
        {label}
      </span>
      <span className="text-sm font-bold tabular-nums">{value}</span>
    </div>
  );
}

/* ── action button ── */
function ActionBtn({ href, accent = "stone" }) {
  const router = useRouter();
  const variants = {
    amber:
      "border-amber-700/60 bg-amber-900/20 text-amber-400 hover:bg-amber-500 hover:text-white hover:border-amber-500",
    blue: "border-blue-700/60 bg-blue-900/20 text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500",
    emerald:
      "border-emerald-700/60 bg-emerald-900/20 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500",
    violet:
      "border-violet-700/60 bg-violet-900/20 text-violet-400 hover:bg-violet-500 hover:text-white hover:border-violet-500",
    stone:
      "border-stone-600 bg-stone-800 text-stone-300 hover:bg-stone-600 hover:text-white",
  };
  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${variants[accent] || variants.stone}`}
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </button>
  );
}

/* ── section block ── */
function Block({ title, count, accent, actions, chart, pills, viewHref }) {
  const router = useRouter();
  const accentText = {
    amber: "text-amber-400",
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    violet: "text-violet-400",
    stone: "text-stone-300",
  };
  const accentBorder = {
    amber: "border-l-amber-500",
    blue: "border-l-blue-500",
    emerald: "border-l-emerald-500",
    violet: "border-l-violet-500",
    stone: "border-l-stone-500",
  };
  const ringColor = {
    amber: "#f59e0b",
    blue: "#60a5fa",
    emerald: "#34d399",
    violet: "#a78bfa",
    stone: "#a8a29e",
  };

  return (
    <div
      className={`rounded-2xl border border-stone-800 border-l-4 ${accentBorder[accent]} bg-stone-950/80 overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-stone-500">
            {title}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={`text-4xl font-black tabular-nums ${accentText[accent]}`}
            >
              {count ?? "—"}
            </span>
            <span className="text-sm text-stone-600 font-medium">kayıt</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Ring
            value={count ?? 0}
            max={Math.max(count ?? 0, 100)}
            color={ringColor[accent]}
          />
          {viewHref && (
            <button
              onClick={() => router.push(viewHref)}
              className="text-xs font-semibold text-stone-500 hover:text-stone-200 transition-colors uppercase tracking-widest cursor-pointer"
            >
              Tümü →
            </button>
          )}
        </div>
      </div>

      {/* Chart */}
      {chart && (
        <div className="px-4 pb-5">
          <BarChart bars={chart} />
        </div>
      )}

      {/* Pills */}
      {pills?.length > 0 && (
        <div className="px-4 pb-3 space-y-1.5">
          {pills.map((p) => (
            <StatPill key={p.label} {...p} />
          ))}
        </div>
      )}

      {/* Actions */}
      {actions?.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-4">
          {actions.map((a) => (
            <ActionBtn key={a.label} href={a.href} accent={accent}>
              {a.label}
            </ActionBtn>
          ))}
        </div>
      )}
    </div>
  );
}

const LEVEL_COLORS = {
  error: "text-red-400 bg-red-900/30 border-red-800/50",
  warn: "text-amber-400 bg-amber-900/30 border-amber-800/50",
  info: "text-blue-400 bg-blue-900/30 border-blue-800/50",
  http: "text-stone-300 bg-stone-800/60 border-stone-700",
  debug: "text-stone-400 bg-stone-800/40 border-stone-700",
};

/* ── user summary card (superadmin only) ── */
function UserSummaryCard({ summary }) {
  const roleColor = (roles) => {
    if (roles?.includes("superadmin"))
      return "text-red-400 bg-red-900/30 border-red-800/50";
    if (roles?.includes("admin"))
      return "text-amber-400 bg-amber-900/30 border-amber-800/50";
    if (roles?.includes("premium"))
      return "text-violet-400 bg-violet-900/30 border-violet-800/50";
    return "text-stone-400 bg-stone-800/40 border-stone-700";
  };
  return (
    <div className="rounded-2xl border border-l-4 border-stone-800 border-l-rose-500 bg-stone-950/80 overflow-hidden">
      <div className="flex items-start justify-between px-4 pt-4 pb-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-stone-500">
            Kullanıcılar
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-black tabular-nums text-rose-400">
              {summary.total}
            </span>
            <span className="text-sm text-stone-600 font-medium">kayıtlı</span>
          </div>
        </div>
        <Ring
          value={summary.total}
          max={Math.max(summary.total, 100)}
          color="#fb7185"
        />
      </div>
      <div className="px-4 pb-4 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-600 mb-1">
          Son 3 Kayıt
        </p>
        {summary.recent.map((u) => (
          <div key={u._id} className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-stone-200 truncate">
                {u.name}
              </p>
              <p className="text-[10px] text-stone-500 truncate">{u.email}</p>
            </div>
            <span
              className={`shrink-0 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${roleColor(u.roles)}`}
            >
              {u.roles?.[u.roles.length - 1] ?? "user"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LogCard({ log, onClick }) {
  if (!log) return null;
  const levelCls = LEVEL_COLORS[log.level] || LEVEL_COLORS.debug;
  const ts = new Date(log.timestamp).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div
      onClick={onClick}
      className="rounded-2xl border border-l-4 border-stone-800 border-l-red-500 bg-stone-950/80 px-4 py-3 cursor-pointer hover:bg-stone-900/60 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-500">
          Son Log
        </p>
        <span
          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${levelCls}`}
        >
          {log.level}
        </span>
      </div>
      <p className="text-sm text-stone-200 font-medium truncate">
        {log.message}
      </p>
      <div className="flex items-center gap-3 mt-2">
        <span className="text-xs text-stone-500">{log.service}</span>
        {log.meta?.userId && (
          <span className="text-xs text-stone-500 font-mono truncate max-w-[120px]">
            {log.meta.userId}
          </span>
        )}
        <span className="text-xs text-stone-600 ml-auto">{ts}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [lastLog, setLastLog] = useState(null);
  const [userSummary, setUserSummary] = useState(null);
  const [assignedCount, setAssignedCount] = useState(null);
  const isSuperAdmin = user?.roles?.includes("superadmin");

  useEffect(() => {
    axios
      .get("/api/stats")
      .then(({ data }) => {
        if (data.success) setStats(data.stats);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isSuperAdmin) return;
    axios
      .get("/api/logs?limit=1")
      .then(({ data }) => {
        if (data.logs?.[0]) setLastLog(data.logs[0]);
      })
      .catch(() => {});
    axios
      .get("/api/auth/users/summary")
      .then(({ data }) => {
        if (data.success) setUserSummary(data);
      })
      .catch(() => {});
  }, [isSuperAdmin]);

  useEffect(() => {
    if (isSuperAdmin) return;
    axios.get("/api/price-list/assigned")
      .then(({ data }) => {
        setAssignedCount(data.records?.length ?? 0);
      })
      .catch(() => setAssignedCount(0));
  }, [isSuperAdmin]);

  const s = stats;

  const offerChart = s
    ? [
        {
          label: "Teklif",
          value: s.offersByType?.Teklif ?? 0,
          color: "#f59e0b",
        },
        {
          label: "Proforma",
          value: s.offersByType?.Proforma ?? 0,
          color: "#60a5fa",
        },
        {
          label: "Sipariş",
          value: s.offersByType?.["Sipariş"] ?? 0,
          color: "#a78bfa",
        },
        {
          label: "Sözleşme",
          value: s.offersByType?.["Sözleşme"] ?? 0,
          color: "#c084fc",
        },
      ]
    : null;

  const offerPills = offerChart
    ?.filter((b) => b.value > 0)
    .map((b) => ({
      label: b.label,
      value: b.value,
      accent:
        b.label === "Teklif"
          ? "amber"
          : b.label === "Proforma"
            ? "blue"
            : b.label === "Sipariş"
              ? "emerald"
              : b.label === "Sözleşme"
                ? "purple"
                : "violet",
    }));

  return (
    <div className="p-6 space-y-6">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-stone-100 tracking-tight">
            {user?.name ? `Merhaba, ${user.name.split(" ")[0]}` : "Dashboard"}
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            {new Date().toLocaleDateString("tr-TR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        {s && (
          <div className="hidden sm:flex items-center gap-2">
            {[
              { v: s.offers, c: "text-amber-400", label: "Belge" },
              ...(isSuperAdmin ? [{ v: s.products, c: "text-blue-400", label: "Ürün" }] : []),
              { v: s.companies, c: "text-emerald-400", label: "Firma" },
              { v: s.contacts, c: "text-violet-400", label: "Kişi" },
            ].map((x) => (
              <div
                key={x.label}
                className="flex flex-col items-center px-3 py-2 rounded-xl bg-stone-900 border border-stone-800"
              >
                <span className={`text-xl font-black tabular-nums ${x.c}`}>
                  {x.v}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600 mt-0.5">
                  {x.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Org card */}
      {user?.orgId && (
        <div
          onClick={() => router.push("/shield/organization")}
          className="flex items-center justify-between px-5 py-3 rounded-2xl border border-l-4 border-stone-800 border-l-amber-500 bg-stone-950/80 cursor-pointer hover:bg-stone-900/60 transition-colors"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-stone-500">
              Organizasyon
            </p>
            <p className="text-sm font-semibold text-stone-200 mt-0.5">
              {user?.orgRole === "owner"
                ? "Sahip"
                : user?.orgRole === "admin"
                  ? "Yönetici"
                  : "Üye"}
            </p>
          </div>
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
            Yönet →
          </span>
        </div>
      )}

      {/* 3-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Col 1: Teklifler + Log kısayolu (superadmin) */}
        <div className="flex flex-col gap-3">
          <Block
            title="Belgeler"
            count={s?.offers}
            accent="amber"
            viewHref="/shield/offer"
            chart={offerChart}
            pills={offerPills}
            actions={[{ label: "Yeni Teklif", href: "/shield/offer/new" }]}
          />
          {isSuperAdmin && (
            <LogCard
              log={lastLog}
              onClick={() => router.push("/shield/logs")}
            />
          )}
        </div>

        {/* Col 2: Markalar + Ürünler + Opsiyonlar (superadmin) veya Fiyat Listelerim (user) */}
        <div className="flex flex-col gap-3">
          {isSuperAdmin && (
            <>
              <Block
                title="Master Ürünler"
                count={s?.products}
                accent="blue"
                viewHref="/shield/master"
                actions={[{ label: "Yeni Ürün", href: "/shield/master/new" }]}
              />
              <Block
                title="Opsiyonlar"
                count={s?.options}
                accent="violet"
                viewHref="/shield/option"
                actions={[{ label: "Yeni Opsiyon", href: "/shield/option/new" }]}
              />
              <Block
                title="Markalar"
                count={s?.makes}
                accent="stone"
                viewHref="/shield/make"
                actions={[{ label: "Yeni Marka", href: "/shield/make/new" }]}
              />
              <Block
                title="Fiyat Listeleri"
                count={null}
                accent="amber"
                viewHref="/shield/price-list"
                actions={[
                  { label: "Yeni Liste", href: "/shield/price-list/new" },
                ]}
              />
            </>
          )}
          {!isSuperAdmin && (
            <Block
              title="Fiyat Listelerim"
              count={assignedCount}
              accent="blue"
              viewHref="/shield/price-list"
            />
          )}
        </div>

        {/* Col 3: Firmalar + Kişiler + Users (superadmin) */}
        <div className="flex flex-col gap-3">
          <Block
            title="Firmalar"
            count={s?.companies}
            accent="emerald"
            viewHref="/shield/company"
            actions={[{ label: "Yeni Firma", href: "/shield/company/new" }]}
          />
          <Block
            title="Kişiler"
            count={s?.contacts}
            accent="violet"
            viewHref="/shield/contact"
            actions={[{ label: "Yeni Kişi", href: "/shield/contact/new" }]}
          />
          {isSuperAdmin && userSummary && (
            <UserSummaryCard summary={userSummary} />
          )}
        </div>
      </div>
    </div>
  );
}
