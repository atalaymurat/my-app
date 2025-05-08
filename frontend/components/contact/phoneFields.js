import { Formik, Form, FieldArray, useFormikContext } from "formik";
import FormikControl from "../formik/FormikControl";

export default function PhoneFields() {
  return (
    <FieldArray name="phones">
      {({ push, remove, form }) => {
        const { values } = form;
        const { phones } = values;
        return (
          <div className="border border-gray-300 rounded-lg py-4 px-2 mb-2">
            <div>Telefonlar</div>
            {phones?.map((ph, index) => (
              <div key={index} className="grid grid-cols-5 gap-1">
                <FormikControl
                  control="mask"
                  className="col-span-4"
                  type="text"
                  label="No"
                  name={`phones.${index}`}
                  mask="+__ (___) ___ __ __"
                  replacement={{ _: /\d/ }} // Only numbers allowed
                  placeholder="+90 (5__) ___ __ __"
                />
                <div className="flex items-center">
                  <button
                    type="button"
                    className="btn-mini-cancel mt-2 ml-1 py-3 w-full h-auto"
                    onClick={() => remove(index)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn-submit my-2 w-full"
              onClick={() =>
                push("")
              }
            >
              Telefon Ekle
            </button>
          </div>
        );
      }}
    </FieldArray>
  );
}
