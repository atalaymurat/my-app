import NewForm from "@/components/master/NewForm";

const NewMasterPage = () => {
  return (
    <div className="p-8 flex flex-col gap-4 overflow-hidden w-full">
      <div className="font-bold text-2xl text-white">
        Yeni Master Sablon Urun Ekle
    </div>
      <NewForm />
    </div>
  )
}
export default NewMasterPage;