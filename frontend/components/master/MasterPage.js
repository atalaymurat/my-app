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
    return <div className="p-8">Loading data from server...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] text-white">
      <div className="flex-1">
        <PageLinks links={[{ href: "/shield/master/new", label: "Yeni Ekle" }]} />
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
