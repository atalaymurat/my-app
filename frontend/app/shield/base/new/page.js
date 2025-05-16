import NewForm from "@/components/base/NewForm";

const NewBasePage = () => {
  return (
    <div className="p-8 flex flex-col gap-4 overflow-hidden w-full">
      <div className="font-bold text-2xl text-white">
        Yeni Temel Urun Olustur
    </div>
      <NewForm />
    </div>
  )
}
export default NewBasePage;