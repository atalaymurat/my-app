import { FieldArray, useFormikContext } from "formik";
import PhoneRow from "./PhoneRow";

export default function PhoneFields() {
  const { values } = useFormikContext();
  const { phones } = values;

  return (
    <FieldArray name="phones">
      {({ push, remove }) => (
        <div className="border border-blue-800 rounded-lg py-4 px-2 mb-2">
          <div className="text-xl font-semibold mb-2 text-blue-800">Telefonlar</div>
          {phones.map((_, index) => (
            <PhoneRow
              key={index}
              index={index}
              onRemove={remove}
              phones={phones}
            />
          ))}
          {phones.length < 3 && (
            <button
              type="button"
              className="btn-submit w-full"
              onClick={() => push("90")}
            >
              Telefon Ekle
            </button>
          )}
        </div>
      )}
    </FieldArray>
  );
}
