import NewForm from "@/components/option/NewForm";

const NewOptionPage = () => {
  return (
    <div className="p-8 flex flex-col gap-4 overflow-hidden w-full">
      <div className="font-bold text-2xl text-white">
        Yeni Opsiyon Olustur
    </div>
      <NewForm />
    </div>
  )
}
export default NewOptionPage;