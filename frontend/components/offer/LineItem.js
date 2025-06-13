// LineItem.js
import React from "react";
import FormikControl from "../formik/FormikControl";
import { InfoBlock } from "./InfoBlock";

export function LineItem({ item, index, options, handleSelect, remove, canRemove }) {
  return (
    <div
      key={index}
      className="bg-black my-3 border border-stone-400 rounded-xl py-2 px-2"
    >
      <select
        name={`lineItems.${index}.productValue`}
        value={item.productValue || ""}
        onChange={handleSelect(index)}
        className="w-full py-2 rounded text-white border border-stone-200 bg-black"
      >
        <option value="">-- Ürün Seç --</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <FormikControl
        control="input"
        type="text"
        label="Ürün Başlık"
        name={`lineItems.${index}.title`}
        readOnly
      />

      {item.options?.length > 0 && (
        <InfoBlock title="İlave Opsiyonlar">
          {item.options.join("\n")}
        </InfoBlock>
      )}

      {item.desc && <InfoBlock title="Açıklamalar">{item.desc}</InfoBlock>}

      <div className="grid grid-cols-2 gap-2">
        <FormikControl
          control="price"
          label="Liste Fiyat"
          name={`lineItems.${index}.priceList`}
        />
        <FormikControl
          control="input"
          label="Döviz"
          name={`lineItems.${index}.currencyList`}
          readOnly
        />
        <FormikControl
          control="price"
          label="Net Fiyat"
          name={`lineItems.${index}.priceNet`}
        />
        <FormikControl
          control="input"
          label="Döviz"
          name={`lineItems.${index}.currencyNet`}
          readOnly
        />
      </div>

      <FormikControl
        control="textArea"
        label="Not"
        name={`lineItems.${index}.notes`}
      />

      {canRemove && (
        <button
          type="button"
          className="btn-purple my-2 w-full"
          onClick={() => remove(index)}
        >
          Sil
        </button>
      )}
    </div>
  );
}
