"use client";
import { useParams } from "next/navigation";
import NewForm from "@/components/master/NewForm";

const EditMasterPage = () => {
  const { id } = useParams();
  return (
    <div className="p-8 flex flex-col gap-4 overflow-hidden w-full">
      <div className="font-bold text-2xl text-white">Master Ürün Düzenle</div>
      <NewForm masterId={id} />
    </div>
  );
};

export default EditMasterPage;
