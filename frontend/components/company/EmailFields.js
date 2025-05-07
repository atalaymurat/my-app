
import { Formik, Form, FieldArray, useFormikContext } from "formik";
import FormikControl from "../formik/FormikControl";

export default function EmailFields({ }) {
  return (
    <FieldArray name="emails">
      {({ push, remove, form }) => {
        const { values } = form;
        const { emails } = values;
        return (
          <div className="border border-gray-300 rounded-lg py-4 px-2 mb-2">
            <div>E-Postalar</div>
            {emails?.map((em, index) => (
              <div key={index} className="grid grid-cols-5 gap-1">
                <div className="col-span-4">
                  <FormikControl
                    control="input"
                    type="text"
                    label="Eposta"
                    name={`emails.${index}`}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    className="btn-mini-cancel ml-1 py-3 w-full h-auto"
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
              Email Ekle
            </button>
          </div>
        );
      }}
    </FieldArray>
  );
}
