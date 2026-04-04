import { useState, useEffect, useMemo } from "react";
import axios from "@/utils/axios";

export function useOfferItems() {
  const [masters, setMasters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/master/offer");
        setMasters(data.list || []);
      } catch (e) {
        console.error("Error fetching products", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const items = useMemo(() =>
    masters.map((p) => ({
      value: String(p.value),
      label: p.label,
      image: p.image || "",
      title: p.caption,
      desc: p.caption,
      currency: p.currency,
      condition: p.condition,
      makeId: String(p.makeId),
      makeName: p.makeName,
      variants: p.variants || [],
    })),
    [masters]
  );

  const makes = useMemo(() => {
    const map = {};
    items.forEach((p) => {
      if (p.makeId && !map[p.makeId]) {
        map[p.makeId] = { value: p.makeId, label: p.makeName };
      }
    });
    return Object.values(map);
  }, [items]);

  return { items, makes, loading };
}
