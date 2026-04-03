import OptionForm from "@/components/option/OptionForm";

const NewOptionPage = () => {
  return (
    <div className="p-8 flex flex-col gap-4 overflow-hidden w-full">
      <div className="font-bold text-2xl text-white">Yeni Opsiyon Oluştur</div>
      <OptionForm />
    </div>
  );
};
export default NewOptionPage;