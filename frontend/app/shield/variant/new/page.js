import NewForm from "@/components/variant/NewForm";

const NewVariantPage = () => {
  return (
    <div className="p-8 flex flex-col gap-4 overflow-hidden w-full">
      <div className="font-bold text-2xl text-white">
        Yeni Varyant Olustur
    </div>
      <NewForm />
    </div>
  )
}
export default NewVariantPage;