"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/utils/axios";
import PageLinks from "../templates/PageLinks";
import MasterTable from "./MasterTable";
import Pagination from "../Pagination";

const BasePage = () => {
  const [masterProducts, setMasterProducts] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`/api/master?page=${currentPage}&limit=10`);
        setMasterProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching master products:", error);
      }
    };
    getData();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    router.push(`/shield/base?page=${newPage}`);
  };

  const handleDelete = async (item) => {
    if (!confirm(`"${item.title}" silinsin mi?`)) return;
    try {
      await axios.delete(`/api/master/${item._id}`);
      setMasterProducts((prev) => prev.filter((p) => p._id !== item._id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (item) => {
    router.push(`/shield/master/${item._id}/edit`);
  };

  if (masterProducts === null) {
    return (
      <div className="px-2 py-2 grid grid-cols-1 lg:grid-cols-2 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex border border-stone-700/40 rounded-xl overflow-hidden bg-stone-900/30 animate-pulse">
            <div className="w-14 sm:w-20 flex-shrink-0 bg-stone-800/60" style={{ minHeight: 72 }} />
            <div className="flex-1 p-3 flex flex-col gap-2">
              <div className="flex justify-between">
                <div className="h-3.5 w-36 bg-stone-700/60 rounded" />
                <div className="h-3 w-12 bg-stone-800/60 rounded" />
              </div>
              <div className="h-2.5 w-20 bg-stone-800/40 rounded" />
              <div className="flex gap-1.5 mt-1">
                <div className="h-6 w-24 bg-stone-800/60 rounded-lg" />
                <div className="h-6 w-20 bg-stone-800/60 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] text-white">
      <div className="flex-1">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => router.push("/shield/profile")}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-400 hover:text-stone-200 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-xl font-black text-stone-100 flex-1">Master Ürünler</h1>
          <button onClick={() => router.push("/shield/master/new")}
            className="w-8 h-8 rounded-lg bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </button>
        </div>
        {masterProducts.length === 0 ? (
          <div className="p-8 text-stone-400">Henüz ürün eklenmemiş.</div>
        ) : (
          <MasterTable masterProducts={masterProducts} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default BasePage;
