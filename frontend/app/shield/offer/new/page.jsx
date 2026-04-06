import NewForm from "@/components/offer/NewForm";

const NewOfferPage = () => {
  return (
    <div className="px-1 md:px-8 py-8 flex flex-col gap-4 overflow-hidden w-full">
      <div className="px-2 font-bold text-2xl text-white">
        Yeni Teklif Olustur...
    </div>
      <NewForm />
    </div>
  )
}
export default NewOfferPage;