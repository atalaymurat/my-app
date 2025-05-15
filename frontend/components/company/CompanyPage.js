import CompanyTable from "./CompanyTable";
import Pagination from "../Pagination";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CompanyListSkeleton from "../skeleton/CompanyListSkeleton";
import axios from "@/utils/axios";
import PageLinks from "../templates/PageLinks";

const CompanyPage = ({}) => {
  const [companies, setCompanies] = useState([]);
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

  if (companies.length === 0) {
    return (
      <PageLinks
        links={[{ href: "/shield/company/new", label: "Firma Ekle" }]}
      />
    );
  }

  if (companies.length > 0) {
    return (
      <div>
        <PageLinks
          links={[{ href: "/shield/company/new", label: "Firma Ekle" }]}
        />
        <CompanyTable companies={companies} />
        <div className="text-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    );
  }
};

export default CompanyPage;
