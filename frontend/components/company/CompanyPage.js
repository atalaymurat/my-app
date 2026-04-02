import CompanyTable from "./CompanyTable";
import Pagination from "../Pagination";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/utils/axios";
import PageLinks from "../templates/PageLinks";

const CompanyPage = ({}) => {
  const [companies, setCompanies] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const { data } = await axios.get(
          `/api/company?page=${currentPage}&limit=10`
        );
        setCompanies(data.companies);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    getCompanies();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    router.push(`/shield/company?page=${newPage}`);
  };

  const handleDelete = async (co) => {
    if (!confirm(`"${co.title}" silinsin mi?`)) return;
    try {
      await axios.delete(`/api/company/${co._id}`);
      setCompanies((prev) => prev.filter((c) => c._id !== co._id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (co) => {
    router.push(`/shield/company/${co._id}/edit`);
  };

  if (companies === null) {
    return <div className="p-8">Loading data from server...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] text-white">
      <div className="flex-1">
        <PageLinks
          links={[{ href: "/shield/company/new", label: "Firma Ekle" }]}
        />
        {companies.length === 0 ? (
          <div className="p-8 text-stone-400">Henüz firma eklenmemiş.</div>
        ) : (
          <CompanyTable companies={companies} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CompanyPage;
