// useProductOptions.js
import { useState, useEffect, useMemo } from "react";
import axios from "@/utils/axios";

export function useProductOptions() {
  const [base, setBase] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [b, c] = await Promise.all([
          axios.get("/api/base-product?limit=all"),
          axios.get("/api/configuration?limit=all"),
        ]);
        setBase(b.data.products);
        setConfigs(c.data.records);
      } catch (e) {
        console.error("Error fetching products", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const options = useMemo(
    () => [
      ...base.map((p) => ({
        value: `base_${p._id}`,
        label: `${p.title} _BS`,
        title: p.title,
        priceList: p.priceList?.value,
        currencyList: p.priceList?.currency,
        type: "base",
        desc: p.description,
      })),
      ...configs.map((c) => ({
        value: `conf_${c._id}`,
        label: `${c.title} _CF`,
        title: c.title,
        priceList: c.priceList.value,
        currencyList: c.priceList?.currency,
        options: c.options.map((o) => o.title),
        type: "configuration",
      })),
    ],
    [base, configs]
  );

  return { options, loading };
}
