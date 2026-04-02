"use client";
import { useEffect, useState } from "react";
import Pagination from "../Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/utils/axios";
import PageLinks from "../templates/PageLinks";
import OptionTable from "./OptionTable";

const OptionPage = () => {
  const [options, setOptions] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`/api/option?page=${currentPage}&limit=10`);
        setOptions(data.options);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    getData();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    router.push(`/shield/option?page=${newPage}`);
  };

  const handleDelete = async (item) => {
    if (!confirm(`"${item.title}" silinsin mi?`)) return;
    try {
      await axios.delete(`/api/option/${item._id}`);
      setOptions((prev) => prev.filter((o) => o._id !== item._id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (item) => {
    router.push(`/shield/option/${item._id}/edit`);
  };

  if (options === null) {
    return <div className="p-8">Loading data from server...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] text-white">
      <div className="flex-1">
        <PageLinks links={[{ href: "/shield/option/new", label: "Yeni Option Ekle" }]} />
        {options.length === 0 ? (
          <div className="p-8 text-stone-400">Henüz option eklenmemiş.</div>
        ) : (
          <OptionTable options={options} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default OptionPage;
