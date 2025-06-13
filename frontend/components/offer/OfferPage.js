"use client";
import { useEffect, useState } from "react";
import Pagination from "../Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/utils/axios";
import PageLinks from "../templates/PageLinks";
import OfferTable from "./OfferTable";

const OfferPage = () => {
  const [offers, setOffers] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          `/api/offer?page=${currentPage}&limit=10`
        );
        setOffers(data.records);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };
    getData();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    router.push(`/shield/offer?page=${newPage}`);
  };
  if (!offers) {
    return <PageLinks links={[{ href: "/shield/offer/new", label: "New" }]} />;
  }
  if (offers) {
    return (
      <>
        <div className="text-white">
          <PageLinks links={[{ href: "/shield/offer/new", label: "New" }]} />
          <OfferTable offers={offers} />
        </div>
        <div className="text-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        <pre>{JSON.stringify(offers, null, 2)}</pre>
      </>
    );
  }
};

export default OfferPage;
