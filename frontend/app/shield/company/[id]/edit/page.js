"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import CompanyForm from "@/components/company/CompanyForm";

const EditCompanyPage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    axios.get(`/api/company/${id}`).then(({ data }) => {
      if (data.success) setCompany(data.company);
    });
  }, [id]);

  return (
    <div className="p-8 flex flex-col gap-4 w-full">
      <div className="font-bold text-2xl text-white">Firma Düzenle</div>
      {company ? <CompanyForm company={company} /> : <div className="text-stone-400">Yükleniyor...</div>}
    </div>
  );
};

export default EditCompanyPage;
