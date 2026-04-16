"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import SuperadminGuard from "@/components/guards/SuperadminGuard";
import OptionForm from "@/components/option/OptionForm";

const EditOptionPage = () => {
  const { id } = useParams();
  const [option, setOption] = useState(null);

  useEffect(() => {
    axios.get(`/api/option/${id}`).then(({ data }) => {
      if (data.success) setOption(data.option);
    });
  }, [id]);

  return (
    <SuperadminGuard>
      <div className="p-8 flex flex-col gap-4 w-full">
        <div className="font-bold text-2xl text-white">Opsiyon Düzenle</div>
        {option ? <OptionForm option={option} /> : <div className="text-stone-400">Yükleniyor...</div>}
      </div>
    </SuperadminGuard>
  );
};

export default EditOptionPage;
