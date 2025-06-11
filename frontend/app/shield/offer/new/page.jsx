import NewForm from "@/components/offer/NewForm";

const NewOfferPage = () => {
  return (
    <div className="p-8 flex flex-col gap-4 overflow-hidden w-full">
      <div className="font-bold text-2xl text-white">
        Yeni Teklif Olustur...
    </div>
      <NewForm />
    </div>
  )
}
export default NewOfferPage;