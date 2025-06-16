// LineItemsFields.js
import React from "react";
import { FieldArray, useFormikContext } from "formik";
import { useProductOptions } from "./useProductOptions";
import { LineItem  } from "./LineItem";

export default function LineItemsFields() {
  const { options, loading } = useProductOptions();
  const { values, setFieldValue } = useFormikContext();

  if (loading) return <div>Loading products…</div>;

  return (
    <FieldArray name="lineItems">
      {({ push, remove }) => {
        const handleSelect = (index) => ({ target: { value } }) => {
          const opt = options.find((o) => o.value === value);
          if (!opt) return;

          setFieldValue(`lineItems.${index}`, {
            productValue: opt.value,
            title: opt.title,
            priceList: opt.priceList,
            priceNet: opt.priceNet,
            currencyList: opt.currencyList,
            currencyNet: opt.currencyList,
            productVariant: opt.productVariant,
            desc: opt.desc,
            options: opt.options,
            notes: "",
            make: opt.make,
            model: opt.model,
            year: opt.year,
            condition: opt.condition,
            createdFromMaster: opt.createdFromMaster,
            image: opt.image,
          });
        };

        return (
          <div className="my-2 border border-stone-400 px-2 py-4 rounded-xl">
            <div className="text-xl font-bold text-stone-300">
              Ürün Bilgileri
            </div>

            {values.lineItems.map((item, idx) => (
              <LineItem
                key={idx}
                index={idx}
                item={item}
                options={options}
                handleSelect={handleSelect}
                remove={remove}
                canRemove={values.lineItems.length > 1}
              />
            ))}

            <button
              type="button"
              className="btn-submit my-1 w-full"
              onClick={() => push({})}
            >
              Add +++
            </button>
          </div>
        );
      }}
    </FieldArray>
  );
}
