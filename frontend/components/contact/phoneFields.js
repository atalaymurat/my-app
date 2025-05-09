import { useState, useEffect } from "react";
import { FieldArray, useFormikContext } from "formik";
import PhoneRow from "./PhoneRow";

export default function PhoneFields() {
  const { values, setFieldValue } = useFormikContext();
  const { phones } = values;
  const [countryCodes, setCountryCodes] = useState([]);

  useEffect(() => {
    if (phones.length > countryCodes.length) {
      const diff = phones.length - countryCodes.length;
      setCountryCodes((prev) => [...prev, ...Array(diff).fill("90")]);
    }
  }, [phones, countryCodes]);

  const handleCountryChange = (index, newCode) => {
    const updated = [...countryCodes];
    updated[index] = newCode;
    setCountryCodes(updated);
  };

  const handleRemove = (removeFn, index) => {
    removeFn(index);
    setCountryCodes((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fullPhones = phones.map((ph, i) => {
      const cleaned = ph.replace(/\D/g, "");
      return countryCodes[i] + cleaned;
    });
    setFieldValue("formattedPhones", fullPhones);
  }, [phones, countryCodes, setFieldValue]);

  return (
    <FieldArray name="phones">
      {({ push, remove }) => (
        <div className="border border-gray-300 rounded-lg py-4 px-2 mb-2">
          <div className="text-lg font-medium mb-2">Telefonlar</div>
          {phones.map((ph, index) => (
            <PhoneRow
              key={index}
              index={index}
              value={ph}
              countryCode={countryCodes[index] || "90"}
              onCountryChange={handleCountryChange}
              onRemove={(i) => handleRemove(remove, i)}
            />
          ))}

          <button
            type="button"
            className="btn-submit w-full"
            onClick={() => push("")}
          >
            Telefon Ekle
          </button>
        </div>
      )}
    </FieldArray>
  );
}
