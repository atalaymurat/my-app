// LineItemsFields.js
import React from "react";
import { FieldArray, useFormikContext } from "formik";
import { useOfferItems } from "./useProductMasters";
import { LineItem } from "./LineItem";
import axios from "@/utils/axios";

export default function LineItemsFields() {
  const { items, loading } = useOfferItems();
  const { values, setFieldValue } = useFormikContext();

  if (loading) return <div>Loading products…</div>;

  return (
    <FieldArray name="lineItems">
      {({ push, remove }) => {
        const handleSelect =
          (index) =>
          async ({ target: { value } }) => {
            console.log("VALUE", value);
            // Seçilen İtem Option larını getiriyoruz api den
            const { data } = await axios.get(`/api/option/list/${value}`);
            console.log("Optiıns by Item", data);
            const optionListById = data.list;
            const item = items.find((o) => o.value === value);
            if (!item) return;

            setFieldValue(`lineItems.${index}`, {
              productValue: item.value,
              title: item.title,
              currency: item.currency,
              desc: item.caption,
              options: optionListById,
              selectedOptions: [],
              notes: "",
              condition: item.condition,
              image: item.image,
              quantity: 1,
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
                options={items}
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
            <pre>{JSON.stringify(items, null,2)}</pre>
          </div>
        );
      }}
    </FieldArray>
  );
}
