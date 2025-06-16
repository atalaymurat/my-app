"use client";
import { useEffect, useState } from "react";
import Pagination from "../Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/utils/axios";
import PageLinks from "../templates/PageLinks";
import ConfigurationTable from "./VariantTable";

const VariantPage = () => {
  const [variants, setVariants] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          `/api/variant?page=${currentPage}&limit=10`
        );
        setVariants(data.records);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching variants:", error);
      }
    };
    getData();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    router.push(`/shield/variant?page=${newPage}`);
  };
  if (!variants) {
    return (
      <PageLinks
        links={[{ href: "/shield/variant/new", label: "New" }]}
      />
    );
  }
  if (variants) {
    return (
      <>
        <div className="max-w-4xl mx-auto text-white">
          <div>
            <PageLinks
              links={[{ href: "/shield/variant/new", label: "New" }]}
            />
            <ConfigurationTable variants={variants} />
          </div>
          <div className="text-white">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </>
    );
  }
};

export default VariantPage;
