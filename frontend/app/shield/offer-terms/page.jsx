import OfferTermsPanel from "@/components/settings/OfferTermsPanel";

export default function OfferTermsPage() {
  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-stone-100 tracking-tight">Satış Koşulları</h1>
        <p className="text-sm text-stone-500 mt-0.5">Tekliflerinize otomatik eklenen satış koşullarını yönetin</p>
      </div>
      <OfferTermsPanel />
    </div>
  );
}
