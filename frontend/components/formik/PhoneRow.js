import React from "react";
import { FastField } from "formik";
import countries from "../../data/countryCodes";

const formatPhoneNumber = (value) => {
  // Rakamları al
  const digits = value.replace(/\D/g, "");

  // Maksimum 10 rakam
  const sliced = digits.slice(0, 10);

  // Biçimlendir
  const parts = [];
  if (sliced.length > 0) parts.push("(" + sliced.slice(0, 3));
  if (sliced.length >= 3) parts[0] += ")";
  if (sliced.length > 3) parts.push(" " + sliced.slice(3, 6));
  if (sliced.length > 6) parts.push(" " + sliced.slice(6, 8));
  if (sliced.length > 8) parts.push(" " + sliced.slice(8, 10));

  return parts.join("");
};

const PhoneRow = React.memo(
  ({ index, countryCode, onCountryChange, onRemove }) => {
    return (
      <div className="grid grid-cols-6 gap-2 items-end mb-3">
        {/* Ülke */}
        <div className="col-span-2 flex flex-col mb-auto mt-1 text-stone-300">
          <label className="block text-sm font-semibold text-gray-500">
            Ülke
          </label>
          <select
            className="w-full border px-2 py-[8px] border-gray-300 rounded transition duration-300 focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
            value={countryCode}
            onChange={(e) => onCountryChange(index, e.target.value)}
          >
            {countries.map((country) => (
              <option
                key={country.code}
                value={country.dial_code.replace("+", "")}
              >
                {country.name} {country.dial_code}
              </option>
            ))}
          </select>
        </div>

        {/* Telefon No */}
        <div className="col-span-3">
          <FastField name={`phones.${index}`}>
            {({ field, form, meta }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon No
                </label>
                <input
                  type="text"
                  value={field.value || ""}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    form.setFieldValue(field.name, formatted);
                  }}
                  placeholder="(5__) ___ __ __"
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                    meta.touched && meta.error
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                />
                {meta.touched && meta.error && (
                  <div className="mt-1 text-sm text-red-600">{meta.error}</div>
                )}
              </div>
            )}
          </FastField>
        </div>

        {/* Sil */}

        <button
          type="button"
          className="btn-mini-cancel mx-auto py-3 w-[40px] h-[40px] mb-auto mt-[22px] flex items-center justify-center"
          onClick={() => onRemove(index)}
        >
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
        </button>
      </div>
    );
  }
);

export default PhoneRow;
