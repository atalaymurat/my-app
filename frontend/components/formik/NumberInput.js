import React from "react";
import { FastField, ErrorMessage } from "formik";
import TextError from "./TextError";

function NumberInput({ label, name, maxDigits = 4, inputRef, ...rest }) {
  const handleInput = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, maxDigits);
    e.target.value = value;
  };

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
            type="text"
            inputMode="numeric"
            pattern={`\\d{1,${maxDigits}}`}
            maxLength={maxDigits}
            {...field}
            {...rest}
            onInput={(e) => {
              handleInput(e);
              form.setFieldValue(name, e.target.value);
            }}
            value={field.value || ""}
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

export default NumberInput;
