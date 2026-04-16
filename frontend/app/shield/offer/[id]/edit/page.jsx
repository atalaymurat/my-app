import EditForm from "@/components/offer/EditForm";

import { use } from "react";

const EditOfferPage = ({ params }) => {
  const { id } = use(params);
  return (
    <div className="p-8 flex flex-col gap-4 overflow-hidden w-full">
      <div className="font-bold text-2xl text-white">Teklif Düzenle</div>
      <EditForm offerId={id} />
    </div>
  );
};

export default EditOfferPage;
