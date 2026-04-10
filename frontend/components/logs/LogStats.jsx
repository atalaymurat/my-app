"use client";

const StatCard = ({ label, value, color }) => (
  <div className="bg-stone-800 border border-stone-700 rounded-xl p-4 flex flex-col gap-1">
    <span className="text-stone-400 text-xs uppercase tracking-wider">{label}</span>
    <span className={`text-3xl font-bold ${color}`}>{value ?? "—"}</span>
  </div>
);

const MiniBar = ({ data }) => {
  if (!data?.length) return null;
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-1 h-10">
      {data.map((d) => (
        <div
          key={d._id}
          title={`${d._id}: ${d.count}`}
          className="flex-1 bg-amber-500/60 rounded-sm hover:bg-amber-400 transition-colors"
          style={{ height: `${Math.max((d.count / max) * 100, 8)}%` }}
        />
      ))}
    </div>
  );
};

export default function LogStats({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <StatCard label="Errors (24h)" value={stats?.errors24h} color="text-red-400" />
      <StatCard label="Warnings (24h)" value={stats?.warns24h} color="text-yellow-400" />
      <StatCard label="Info (24h)" value={stats?.info24h} color="text-green-400" />
      <div className="bg-stone-800 border border-stone-700 rounded-xl p-4 flex flex-col gap-2">
        <span className="text-stone-400 text-xs uppercase tracking-wider">Son 7 Gün</span>
        <MiniBar data={stats?.daily7d} />
      </div>
    </div>
  );
}
