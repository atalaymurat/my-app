"use client";
import { useEffect, useState } from "react";
import Pagination from "../Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/utils/axios";
import PageLinks from "../templates/PageLinks";
import BaseTable from "./BaseTable";

const BasePage = () => {
  const [baseProducts, setBaseProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          `/api/base-product?page=${currentPage}&limit=10`
        );
        setBaseProducts(data.products);
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
  if (baseProducts?.length === 0) {
    return (
      <div className="text-white max-w-4xl mx-auto">
        <PageLinks links={[{ href: "/shield/base/new", label: "New Base" }]} />
      </div>
    );
  }
  return (
    <>
      <div className="text-white max-w-4xl mx-auto">
        <PageLinks links={[{ href: "/shield/base/new", label: "New Base" }]} />
        <BaseTable baseProducts={baseProducts} />
      </div>
    </>
  );
};

export default BasePage;
