import SuperadminGuard from "@/components/guards/SuperadminGuard";
import MakeForm from "@/components/make/MakeForm";

export default function NewMakePage() {
  return (
    <SuperadminGuard>
      <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-stone-100 tracking-tight">Yeni Marka</h1>
        <p className="text-sm text-stone-500 mt-0.5">Marka bilgilerini girin</p>
      </div>
      <MakeForm />
      </div>
    </SuperadminGuard>
  );
}
