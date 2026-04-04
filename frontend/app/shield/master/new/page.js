import NewForm from "@/components/master/NewForm";

const NewMasterPage = () => {
  return (
    <div className="px-0 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 overflow-hidden w-full">
      <div className="font-bold text-2xl text-white">
        Yeni Master Ürün
    </div>
      <NewForm />
    </div>
  )
}
export default NewMasterPage;