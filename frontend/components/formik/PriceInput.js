import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import TextError from "./TextError";



function formatPrice(value) {
  if (typeof value !== "string") value = value?.toString() || "";
  const cleaned = value.replace(/[^\d,]/g, "");
  const [intPart, decimalPart] = cleaned.split(",");
  const formattedInt = intPart ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
  const decimals = decimalPart ? `,${decimalPart.slice(0, 2)}` : "";
  return `${formattedInt}${decimals}`;
}

function PriceInput({ label, name, inputRef, currency: currencyProp, ...rest }) {
  const { values } = useFormikContext();
  const symbol = currencyProp || values?.currency || "TRY";

  return (
    <Field name={name}>
      {({ field, meta, form }) => (
        <div className="flex flex-col py-1">
          {label && (
            <label htmlFor={name} className="block text-sm font-semibold text-gray-500 mb-1">
              {label}
            </label>
          )}
          <div className={`flex rounded-lg border overflow-hidden transition-colors focus-within:ring-2 focus-within:ring-amber-500/40 focus-within:border-amber-600 ${
            meta.touched && meta.error ? "border-red-600" : "border-stone-600"
          }`}>
            <span className="flex items-center px-2.5 bg-stone-800 border-r border-stone-600 text-stone-400 text-sm font-semibold select-none min-w-[2rem] justify-center">
              {symbol}
            </span>
            <input
              id={name}
              ref={inputRef}
              inputMode="decimal"
              {...rest}
              value={formatPrice(field.value || "")}
              onChange={(e) => {
                const raw = e.target.value
                  .replace(/[^\d,]/g, "")
                  .replace(/,+/g, ",")
                  .replace(/^,/, "");
                form.setFieldValue(name, raw);
              }}
              className="flex-1 bg-stone-900 text-stone-200 text-sm px-3 py-2 focus:outline-none placeholder-stone-600"
              placeholder="0"
            />
          </div>
          <ErrorMessage name={name} component={TextError} />
        </div>
      )}
    </Field>
  );
}

export default PriceInput;
