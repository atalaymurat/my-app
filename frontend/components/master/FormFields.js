"use client";
import FormikControl from "../formik/FormikControl";

const FormFields = () => {
  return (
    <>
      <FormikControl control="input" type="text" label="Marka" name="make" />
      <FormikControl control="input" type="text" label="Model" name="model" />
      <FormikControl
        control="numberInput"
        type="text"
        label="Uretim Yili"
        name="year"
        maxDigits={4}
      />
      <FormikControl
        control="checkboxSingle"
        label="Durumu"
        name="condition"
        className="border border-purple-800 px-2 py-4 rounded-lg h-full w-full"
        options={[
          { label: "Yeni", value: "new" },
          { label: "Kullanilmis", value: "used" },
          { label: "Sifirlanmis", value: "refurbished" },
        ]}
      />
      <FormikControl
        control="textArea"
        type="text"
        label="Aciklama"
        name="description"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 py-4 my-2">
        <div className="border border-green-800 px-2 py-4 rounded-lg h-full w-full">
          <div className="text-stone-200 text-lg">Liste Fiyat</div>
          <div className="flex flex-row gap-2 h-full items-center">
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
            <FormikControl
              control="price"
              label="Fiyat"
              name="priceList.value"
            />
          </div>
        </div>
        <div className="border border-purple-800 px-2 py-4 rounded-lg h-full w-full">
          <div className="text-stone-200 text-lg">Net Fiyat</div>
          <div className="flex flex-row gap-2 h-full items-center">
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
            <FormikControl
              control="price"
              label="Fiyat"
              name="priceNet.value"
            />
          </div>
        </div>
      </div>
      <FormikControl
        control="checkboxSingle"
        label="Varyant Durumu"
        name="productVariant"
        options={[
          { label: "Oldugu Gibi Satilabilir", value: "asItIs" },
          { label: "Konfigurasyon Gerekli", value: "configurable" },
          { label: "Hepsi", value: "both" },
        ]}
      />
    </>
  );
};
export default FormFields;
