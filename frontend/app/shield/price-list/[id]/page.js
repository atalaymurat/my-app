import SuperadminGuard from "@/components/guards/SuperadminGuard";
import PriceListDetail from "@/components/priceList/PriceListDetail";

export default function Page() {
  return (
    <SuperadminGuard>
      <PriceListDetail />
    </SuperadminGuard>
  );
}
