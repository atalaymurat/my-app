"use client";
import { useParams } from "next/navigation";

const EditOptionPage = () => {
  const { id } = useParams();
  return (
    <div className="p-8 flex flex-col gap-4 w-full">
      <div className="font-bold text-2xl text-white">Option Düzenle</div>
      <div className="text-stone-400 text-sm">ID: {id}</div>
    </div>
  );
};

export default EditOptionPage;
