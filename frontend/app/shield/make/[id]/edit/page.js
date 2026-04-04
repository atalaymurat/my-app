"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/utils/axios";
import MakeForm from "@/components/make/MakeForm";

export default function EditMakePage() {
  const { id } = useParams();
  const [make, setMake] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/make/${id}`)
      .then(({ data }) => setMake(data.make))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6 text-stone-500 text-sm">Yükleniyor...</div>;
  if (!make) return <div className="p-6 text-red-400 text-sm">Marka bulunamadı.</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-stone-100 tracking-tight">Marka Düzenle</h1>
        <p className="text-sm text-stone-500 mt-0.5">{make.name}</p>
      </div>
      <MakeForm initial={make} />
    </div>
  );
}
