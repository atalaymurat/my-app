"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/utils/axios";
import PageLinks from "../templates/PageLinks";
import MasterTable from "./MasterTable";

const BasePage = () => {
  const [masterProducts, setMasterProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          `/api/master?page=${currentPage}&limit=10`
        );
        setMasterProducts(data.products);
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
  if (masterProducts?.length === 0) {
    return (
      <div className="text-white max-w-4xl mx-auto">
        <PageLinks links={[{ href: "/shield/master/new", label: "Yeni Ekle" }]} />
      </div>
    );
  }
  return (
    <>
      <div className="text-white max-w-4xl mx-auto">
        <PageLinks links={[{ href: "/shield/master/new", label: "Yeni Ekle" }]} />
        <MasterTable masterProducts={masterProducts} />
      </div>
    </>
  );
};

export default BasePage;
