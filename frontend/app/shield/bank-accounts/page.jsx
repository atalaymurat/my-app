import BankAccountsPanel from "@/components/settings/BankAccountsPanel";

export default function BankAccountsPage() {
  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-stone-100 tracking-tight">Banka Hesapları</h1>
        <p className="text-sm text-stone-500 mt-0.5">PDF belgelerinize eklenecek banka hesap bilgilerini yönetin</p>
      </div>
      <BankAccountsPanel />
    </div>
  );
}
