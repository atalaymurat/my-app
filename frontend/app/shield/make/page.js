"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios";

export default function MakePage() {
  const router = useRouter();
  const [makes, setMakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    setLoading(true);
    axios.get("/api/make")
      .then(({ data }) => setMakes(data.makes || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Bu markayı silmek istediğinize emin misiniz?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`/api/make/${id}`);
      setMakes(m => m.filter(x => x._id !== id));
    } catch {
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/shield/profile")}
          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-400 hover:text-stone-200 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-stone-100 tracking-tight">Markalar</h1>
          <p className="text-sm text-stone-500 mt-0.5">{makes.length} kayıt</p>
        </div>
        <button onClick={() => router.push("/shield/make/new")}
          className="w-8 h-8 rounded-lg bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        </button>
      </div>

      {loading ? (
        <div className="text-stone-500 text-sm">Yükleniyor...</div>
      ) : makes.length === 0 ? (
        <div className="rounded-2xl border border-stone-800 bg-stone-950/80 p-10 text-center">
          <p className="text-stone-400 text-sm">Henüz marka eklenmemiş.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {makes.map(make => (
            <div key={make._id}
              className="rounded-2xl border border-stone-800 bg-stone-950/80 p-4 flex items-center gap-3 group hover:border-stone-600 transition-colors">

              {/* Logo */}
              <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                {make.logo
                  ? <img src={make.logo} alt={make.name} className="w-full h-full object-contain p-1" />
                  : <span className="text-stone-500 text-lg font-black">{make.name?.charAt(0)?.toUpperCase()}</span>
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-stone-200 truncate">{make.name}</p>
                <p className="text-xs text-stone-500 uppercase">{make.country || "—"}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => router.push(`/shield/make/${make._id}/edit`)}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.5-6.5M3 21h4l11-11-4-4L3 17v4z" />
                  </svg>
                </button>
                <button onClick={() => handleDelete(make._id)} disabled={deletingId === make._id}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-red-900/50 text-stone-400 hover:text-red-400 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 011-1h4a1 1 0 011 1m-7 0H5m14 0h-2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
