import SuperadminGuard from "@/components/guards/SuperadminGuard";
import NewForm from "@/components/master/NewForm";

export default function NewMasterPage() {
  return (
    <SuperadminGuard>
      <div className="px-0 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 overflow-hidden w-full">
        <div className="font-bold text-2xl text-white">
          Yeni Master Ürün
        </div>
        <NewForm />
      </div>
    </SuperadminGuard>
  );
}