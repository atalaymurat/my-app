// LineItem.js
import React from "react";
import FormikControl from "../formik/FormikControl";
import { InfoBlock } from "./InfoBlock";
import { useFormikContext } from "formik";

export function LineItem({
  item,
  index,
  options,
  handleSelect,
  remove,
  canRemove,
}) {
  // Optıon Listesinden Seçileni selectedOptions Formik Hafızasına alıyoruz
  const { values, setFieldValue } = useFormikContext();
  // Opsyonların Liste Fiyatına Eklenmesini Saglayan Fonksyon
  const recalculateLinePrice = (lineIndex, selectedOptions) => {
    const basePrice = values.lineItems[lineIndex].basePrice || 0;

    const optionsTotal = selectedOptions.reduce(
      (sum, opt) => sum + opt.listPrice * (opt.quantity || 1),
      0,
    );

    setFieldValue(`lineItems.${lineIndex}.priceList`, basePrice + optionsTotal);
  };
  const handleOptionToggle = (lineIndex, option) => {
    const current = values.lineItems[lineIndex].selectedOptions || [];

    const exists = current.find((o) => o.value === option.value);

    let updated;

    if (exists) {
      updated = current.filter((o) => o.value !== option.value);
    } else {
      updated = [
        ...current,
        {
          value: option.value,
          label: option.label,
          listPrice: option.listPrice,
          currency: option.currency,
          desc: option.desc,
          quantity: 1, // Default 1
        },
      ];
    }

    setFieldValue(`lineItems.${lineIndex}.selectedOptions`, updated);
    recalculateLinePrice(lineIndex, updated);
  };

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
        <div className="mt-3 border border-stone-700 rounded-lg p-3">
          <p className="text-sm font-semibold mb-2 text-stone-300">
            Opsiyonel Özellikleri Seçiniz...
          </p>

          {item.options.map((option) => {
            const selected = item.selectedOptions?.find(
              (o) => o.value === option.value,
            );
            const isChecked = !!selected;

            return (
              <div key={option.value}>
                <label className="flex items-center gap-2 text-sm cursor-pointer mb-1">
                  <input
                    type="checkbox"
                    checked={isChecked || false}
                    onChange={() => handleOptionToggle(index, option)}
                  />
                  <div className="flex flex-row items-center">
                    <div>
                      {option.label} (+{option.listPrice} {option.currency})
                    </div>
                    <div>{option.desc}</div>
                  </div>
                </label>
                {isChecked && (
                  <input
                    type="number"
                    min="1"
                    value={selected.quantity}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      const updated = item.selectedOptions.map((o) =>
                        o.value === option.value ? { ...o, quantity: qty } : o,
                      );
                      setFieldValue(
                        `lineItems.${index}.selectedOptions`,
                        updated,
                      );

                      recalculateLinePrice(index, updated);
                    }}
                    className="my-1 mx-2 w-20 px-2 py-1 text-sm bg-black border border-stone-600 rounded"
                  />
                )}
              </div>
            );
          })}
        </div>
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
        />
      </div>
      <FormikControl
        control="input"
        type="number"
        label="Adet"
        name={`lineItems.${index}.quantity`}
      />

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
