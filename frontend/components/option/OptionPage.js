"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/utils/axios";
import Pagination from "../Pagination";
import PageLinks from "../templates/PageLinks";
import OptionTable from "./OptionTable";

function groupByMake(options) {
  const map = new Map();
  options.forEach((opt) => {
    const makeId = opt.make?._id || "no-make";
    if (!map.has(makeId)) {
      map.set(makeId, { make: opt.make || null, options: [] });
    }
    map.get(makeId).options.push(opt);
  });
  return Array.from(map.values());
}

const OptionPage = () => {
  const [groups, setGroups] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/option?page=${currentPage}&limit=30`)
      .then(({ data }) => {
        setGroups(groupByMake(data.options || []));
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentPage]);

  const handleDelete = async (item) => {
    if (!confirm(`"${item.title}" silinsin mi?`)) return;
    try {
      await axios.delete(`/api/option/${item._id}`);
      setGroups(prev =>
        prev.map(g => ({ ...g, options: g.options.filter(o => o._id !== item._id) }))
          .filter(g => g.options.length > 0)
      );
    } catch {}
  };

  const handleEdit = (item) => router.push(`/shield/option/${item._id}/edit`);

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      <div className="flex-1">
        <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
          <button onClick={() => router.push("/shield/profile")}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-400 hover:text-stone-200 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-black text-stone-100">Opsiyonlar</h1>
            <p className="text-xs text-stone-500 mt-0.5">{total} kayıt</p>
          </div>
          <button onClick={() => router.push("/shield/option/new")}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded-lg transition-colors">
            + Yeni Opsiyon
          </button>
        </div>

        {loading ? (
          <div className="px-4 text-stone-500 text-sm">Yükleniyor...</div>
        ) : groups.length === 0 ? (
          <div className="px-4 text-stone-400 text-sm">Henüz opsiyon eklenmemiş.</div>
        ) : (
          <div className="space-y-6 px-2 sm:px-4 pb-6">
            {groups.map((group) => (
              <div key={group.make?._id || "no-make"}>
                {/* Marka başlığı */}
                <div className="flex items-center gap-3 px-2 mb-2">
                  {group.make?.logo
                    ? <img src={group.make.logo} alt={group.make.name} className="w-6 h-6 object-contain rounded" />
                    : <div className="w-6 h-6 rounded bg-stone-800 border border-stone-700 flex items-center justify-center text-[10px] font-bold text-stone-500">?</div>
                  }
                  <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
                    {group.make?.name || "Markasız"}
                  </span>
                  <span className="text-[10px] text-stone-600 font-medium">({group.options.length})</span>
                  <div className="flex-1 h-px bg-stone-800 ml-1" />
                </div>
                <OptionTable options={group.options} onEdit={handleEdit} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages}
        onPageChange={(p) => router.push(`/shield/option?page=${p}`)} />
    </div>
  );
};

export default OptionPage;
