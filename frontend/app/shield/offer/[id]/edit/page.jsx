import NewForm from "@/components/offer/NewForm";

const EditOfferPage = ({ params }) => {
  return (
    <div className="p-8 flex flex-col gap-4 overflow-hidden w-full">
      <div className="font-bold text-2xl text-white">Teklif Düzenle</div>
      <NewForm offerId={params.id} />
    </div>
  );
};

export default EditOfferPage;
