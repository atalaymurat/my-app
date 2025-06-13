import React from "react";
import { FastField, ErrorMessage } from "formik";
import TextError from "./TextError";

function formatPrice(value) {
  if (typeof value !== "string") {
    // Eğer value string değilse, stringe çevir (örneğin number olabilir)
    value = value?.toString() || "";
  }
  // Remove all non-digit and comma
  const cleaned = value.replace(/[^\d,]/g, "");

  // Split integer and decimals
  const [intPart, decimalPart] = cleaned.split(",");

  const formattedInt = intPart
    ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    : "";

  const decimals = decimalPart ? `,${decimalPart.slice(0, 2)}` : "";

  return `${formattedInt}${decimals}`;
}

function PriceInput({ label, name, inputRef, ...rest }) {
  return (
    <FastField name={name}>
      {({ field, meta, form }) => (
        <div className="flex flex-col py-1">
          {label && (
            <label
              htmlFor={name}
              className="block text-sm font-semibold text-gray-500"
            >
              {label}
            </label>
          )}
          <input
            id={name}
            ref={inputRef}
            inputMode="decimal"
            {...rest}
            value={formatPrice(field.value || "")}
            onChange={(e) => {
              const raw = e.target.value
                .replace(/[^\d,]/g, "") // Keep digits and comma
                .replace(/,+/g, ",")    // Collapse multiple commas
                .replace(/^,/, "");     // Prevent leading comma

              form.setFieldValue(name, raw);
            }}
            className={`px-1 py-[5px] border text-gray-500 border-gray-300 rounded transition duration-300 focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200 ${
              meta.touched && meta.error ? "border-red-600 border-2" : ""
            }`}
          />
          <ErrorMessage name={name} component={TextError} />
        </div>
      )}
    </FastField>
  );
}

export default PriceInput;