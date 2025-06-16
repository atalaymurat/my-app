// useProductOptions.js
import { useState, useEffect, useMemo } from "react";
import axios from "@/utils/axios";

export function useProductOptions() {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/variant?limit=all");
        setVariants(data.records);
      } catch (e) {
        console.error("Error fetching products", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const options = useMemo(
    () => [
      ...variants.map((p) => ({
        value: `${p._id}`,
        label: `${p.title}`,
        title: p.title,
        priceList: p.priceList?.value,
        currencyList: p.priceList?.currency,
        priceNet: p.priceNet?.value,
        currencyNet: p.priceNet?.currency,
        type: p.productVariant,
        createdFromMaster: p.createdFromMaster,
        make: p.make,
        model: p.model,
        year: p.year,
        condition: p.condition,
        productVariant: p.productVariant,
        desc: p.description,
        options: p.options.map((op) => ({
          value: op._id,
          label: op.title,
          title: op.title,
          description: op.description,
          priceList: op.priceList?.value,
          currencyList: op.priceList?.currency,
          image: op.image,
        })),
      })),
    ],
    [variants]
  );

  return { options, loading };
}
