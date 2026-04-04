import OrgPanel from "@/components/organization/OrgPanel";

export default function OrganizationPage() {
  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-stone-100 tracking-tight">Organizasyon</h1>
        <p className="text-sm text-stone-500 mt-0.5">Grup üyelerini yönetin</p>
      </div>
      <OrgPanel />
    </div>
  );
}
