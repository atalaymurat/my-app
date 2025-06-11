"use client";
import { useEffect, useState } from "react";
import Pagination from "../Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/utils/axios";
import PageLinks from "../templates/PageLinks";
import OptionTable from "./OptionTable";

const OptionPage = () => {
  const [options, setOptions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          `/api/option?page=${currentPage}&limit=10`
        );
        setOptions(data.options);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    getData();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    router.push(`/shield/base?page=${newPage}`);
  };
  if (options?.length === 0) {
    return (
      <PageLinks
        links={[{ href: "/shield/option/new", label: "New Option" }]}
      />
    );
  }
  return (
    <>
      <div className="text-white">
        <PageLinks
          links={[{ href: "/shield/option/new", label: "New Option" }]}
        />
        <OptionTable options={options} />
      </div>
      <div className="text-white">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default OptionPage;
