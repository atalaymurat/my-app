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
        <div className="col-span-2 flex flex-col">
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
        <div className="col-span-1 flex items-center justify-center">
          <button
            type="button"
            className="btn-mini-cancel w-[38px] h-[38px] mt-1"
            onClick={() => onRemove(index)}
          >
            X
          </button>
        </div>
      </div>
    );
  }
);

export default PhoneRow;
