import React, { useState, useEffect, useRef } from "react";
import { useField } from "formik";
import { InputMask } from "@react-input/mask";

const toMasked = (digits) => {
  const d = digits.slice(0, 10);
  let out = "";
  for (let i = 0; i < d.length; i++) {
    if (i === 3 || i === 6 || i === 8) out += " ";
    out += d[i];
  }
  return out;
};

const PhoneRow = React.memo(({ index, onRemove, phones, baseName = "phones" }) => {
  const [field, meta, helpers] = useField(`${baseName}.${index}`);
  const isTyping = useRef(false);

  const parseValue = (val) => {
    if (!val) return { cc: "90", local: "" };
    if (val.includes(":")) {
      const [cc, local] = val.split(":");
      return { cc: cc || "90", local: local || "" };
    }
    // legacy: raw digits
    const d = val.replace(/\D/g, "");
    return { cc: d.slice(0, 2) || "90", local: d.slice(2) };
  };

  const init = parseValue(field.value);
  const [countryCode, setCountryCode] = useState(init.cc);
  const [localNumber, setLocalNumber] = useState(toMasked(init.local));

  useEffect(() => {
    if (isTyping.current) {
      isTyping.current = false;
      return;
    }
    const { cc, local } = parseValue(field.value);
    setCountryCode(cc);
    setLocalNumber(toMasked(local));
  }, [field.value]);

  const handleCountryCode = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCountryCode(val);
    isTyping.current = true;
    helpers.setValue(val + ":" + localNumber.replace(/\D/g, ""));
  };

  const handleLocalNumber = (e) => {
    const masked = e.target.value;
    setLocalNumber(masked);
    isTyping.current = true;
    helpers.setValue(countryCode + ":" + masked.replace(/\D/g, ""));
  };

  return (
    <div className="flex gap-2 items-end mb-3">
      <div className="text-stone-300">
        <label className="block text-sm font-medium text-gray-600">Ülke Kodu</label>
        <div className="flex items-center">
          <span className="px-2 py-[9px] bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500 text-sm">+</span>
          <input
            type="text"
            value={countryCode}
            onChange={handleCountryCode}
            autoComplete="off"
            className="w-[46px] px-2 py-[8px] border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 text-stone-300">
        <label className="block text-sm font-medium text-gray-600">Telefon No</label>
        <InputMask
          mask="___ ___ __ __"
          replacement={{ _: /\d/ }}
          placeholder="___ ___ __ __"
          value={localNumber}
          onChange={handleLocalNumber}
          autoComplete="off"
          className={`block w-full px-3 py-[8px] border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${
            meta.touched && meta.error
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:ring-blue-200"
          }`}
        />
        {meta.touched && meta.error && (
          <div className="mt-1 text-sm text-red-600">{meta.error}</div>
        )}
      </div>

      {phones.length > 1 && (
        <button
          type="button"
          className="btn-mini-cancel py-3 w-[40px] h-[40px] mb-auto mt-[22px] flex items-center justify-center"
          onClick={() => onRemove(index)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      )}
    </div>
  );
});

export default PhoneRow;
