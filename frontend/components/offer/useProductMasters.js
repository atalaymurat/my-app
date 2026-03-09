// useProductOptions.js
import { useState, useEffect, useMemo } from "react";
import axios from "@/utils/axios";

export function useOfferItems() {
  const [masters, setMasters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/master/offer");
        console.log("MASTER S", JSON.stringify(data.list, null, 2));
        setMasters(data.list);
      } catch (e) {
        console.error("Error fetching products", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const items = useMemo(
    () => [
      ...masters.map((p) => ({
        value: `${p.value}`,
        label: `${p.label}`,
        title: p.caption,
        currency: p.currency,

      })),
    ],
    [masters],
  );

  return { items, loading };
}
