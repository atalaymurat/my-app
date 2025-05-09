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
                className="bg-black my-3 border border-blue-700 rounded-xl p-4"
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
                {values.addresses.length > 1 && (
                  <button
                    type="button"
                    className="btn-purple my-2 w-full"
                    onClick={() => remove(index)}
                  >
                    <div className="flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </div>
                  </button>
                )}
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
