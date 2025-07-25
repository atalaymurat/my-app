"use client";
import FormikControl from "../formik/FormikControl";

const FormFields = ({ masterProducts }) => {
  return (
    <>
      <FormikControl control="input" type="text" label="Baslik" name="title" />
      <FormikControl
        control="textArea"
        type="text"
        label="Aciklama"
        name="description"
      />
      <FormikControl
        control="checkboxGroup"
        label="Temel Urun"
        name="masterProducts"
        options={masterProducts}
      />
      <div className="my-4 border border-blue-800 px-2 py-4 rounded-lg h-full w-full">
        <div className="text-stone-200 text-lg">Net Fiyat</div>
        <div className="flex flex-row gap-2 h-full items-end">
          <FormikControl
            control="checkboxSingle"
            label="Doviz"
            name="priceNet.currency"
            options={[
              { label: "TL", value: "TRY" },
              { label: "EUR", value: "EUR" },
              { label: "USD", value: "USD" },
            ]}
          />
          <FormikControl control="price" label="Fiyat" name="priceNet.value" />
        </div>
      </div>
      <div className="border border-blue-800 px-2 py-4 rounded-lg h-full w-full">
        <div className="text-stone-200 text-lg">Liste Fiyat</div>
        <div className="flex flex-row gap-2 h-full items-end">
          <FormikControl
            control="checkboxSingle"
            label="Doviz"
            name="priceList.currency"
            options={[
              { label: "TL", value: "TRY" },
              { label: "EUR", value: "EUR" },
              { label: "USD", value: "USD" },
            ]}
          />
          <FormikControl control="price" label="Fiyat" name="priceList.value" />
        </div>
      </div>
    </>
  );
};
export default FormFields;
