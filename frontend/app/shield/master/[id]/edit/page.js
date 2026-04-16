"use client";
import { useParams } from "next/navigation";
import SuperadminGuard from "@/components/guards/SuperadminGuard";
import NewForm from "@/components/master/NewForm";

const EditMasterPage = () => {
  const { id } = useParams();
  return (
    <SuperadminGuard>
      <div className="px-0 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 overflow-hidden w-full">
        <div className="font-bold text-2xl text-white">Master Ürün Düzenle</div>
        <NewForm masterId={id} />
      </div>
    </SuperadminGuard>
  );
};

export default EditMasterPage;
