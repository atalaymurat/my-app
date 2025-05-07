import { FieldArray } from "formik";
import FormikControl from "../formik/FormikControl";


const AddressFields = () => {
  return (
    <FieldArray name="addresses">
      {({ push, remove, form }) => {
        const { values } = form;
        const { addresses } = values;
        return (
          <div className="my-2 border border-blue-800 px-2 py-4 rounded-xl">
            <div className="text-xl font-bold text-blue-800">
              Adres Bilgileri
            </div>
            {addresses?.map((address, index) => (
              <div
                key={index}
                className="bg-blue-100 my-3 border border-blue-700 rounded-xl p-4"
              >
                <FormikControl
                  control="input"
                  type="text"
                  label="Addres Başlık"
                  name={`addresses.${index}.title`}
                  placeholder="Fabrika, Merkez, Showroom, vs..."
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="Ülke"
                  name={`addresses.${index}.country`}
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="Şehir"
                  name={`addresses.${index}.city`}
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="İlçe"
                  name={`addresses.${index}.district`}
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="Mahalle Sokak"
                  name={`addresses.${index}.line1`}
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="Bina No / Kat"
                  name={`addresses.${index}.line2`}
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="Posta Kodu"
                  name={`addresses.${index}.zip`}
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="Raw Address"
                  name={`addresses.${index}.raw`}
                />
                <button
                  type="button"
                  className="btn-purple my-2 w-full"
                  onClick={() => remove(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-submit my-1 w-full"
              onClick={() =>
                push({
                  title: "",
                  line1: "",
                  line2: "",
                  district: "",
                  city: "",
                  country: "",
                  zip: "",
                })
              }
            >
              Add Address
            </button>
          </div>
        );
      }}
    </FieldArray>
  );
};

export default AddressFields;