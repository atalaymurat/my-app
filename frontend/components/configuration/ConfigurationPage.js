"use client";
import { useEffect, useState } from "react";
import Pagination from "../Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/utils/axios";
import PageLinks from "../templates/PageLinks";
import ConfigurationTable from "./ConfigurationTable";

const ConfigurationPage = () => {
  const [configurations, setConfigurations] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          `/api/configuration?page=${currentPage}&limit=10`
        );
        setConfigurations(data.records);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      }
    };
    getData();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    router.push(`/shield/configuration?page=${newPage}`);
  };
  if (!configurations) {
    return (
      <PageLinks
        links={[{ href: "/shield/configuration/new", label: "New" }]}
      />
    );
  }
  if (configurations) {
    return (
      <>
        <div className="text-white">
          <PageLinks
            links={[{ href: "/shield/configuration/new", label: "New" }]}
          />
          <ConfigurationTable configurations={configurations} />
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
  }
};

export default ConfigurationPage;
