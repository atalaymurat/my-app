import SuperadminGuard from "@/components/guards/SuperadminGuard";
import PriceListForm from "@/components/priceList/PriceListForm";

export default function Page() {
  return (
    <SuperadminGuard>
      <PriceListForm />
    </SuperadminGuard>
  );
}
