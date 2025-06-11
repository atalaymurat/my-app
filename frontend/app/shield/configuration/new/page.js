import NewForm from "@/components/configuration/NewForm";

const NewConfigurationPage = () => {
  return (
    <div className="p-8 flex flex-col gap-4 overflow-hidden w-full">
      <div className="font-bold text-2xl text-white">
        Yeni Konfigurasyon Olustur
    </div>
      <NewForm />
    </div>
  )
}
export default NewConfigurationPage;