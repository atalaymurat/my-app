import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import axios from "@/utils/axios";
import { useFormikContext } from "formik";

export function useOfferItems() {
  const { values, setFieldValue } = useFormikContext();
  const [priceLists, setPriceLists] = useState([]);
  const [snapshotCache, setSnapshotCache] = useState({});
  const [loadingLists, setLoadingLists] = useState(true);
  const [loadingSnapshot, setLoadingSnapshot] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/price-list/assigned");
        setPriceLists(data.records || []);
      } catch (e) {
        console.error("Error fetching price lists", e);
      } finally {
        setLoadingLists(false);
      }
    })();
  }, []);

  const loadSnapshot = useCallback(async (plId) => {
    if (!plId || snapshotCache[plId]) return;
    setLoadingSnapshot(true);
    try {
      const { data } = await axios.get(`/api/price-list/${plId}/snapshot/active`);
      const snapshotItems = (data.list || []).map(p => ({
        ...p,
        _priceListId: plId,
      }));
      setSnapshotCache(prev => ({
        ...prev,
        [plId]: {
          items: snapshotItems,
          meta: {
            priceListId: data.priceListId,
            snapshotVersion: data.snapshotVersion,
            makeName: data.makeName,
          },
        },
      }));
    } catch (e) {
      console.error("Error fetching snapshot", e);
    } finally {
      setLoadingSnapshot(false);
    }
  }, [snapshotCache]);

  useEffect(() => {
    if (initializedRef.current || loadingLists || !priceLists.length) return;
    initializedRef.current = true;

    const hasMissingPriceList = (values.lineItems || []).some(
      li => li.productValue && !li.selectedPriceListId
    );

    const plIds = hasMissingPriceList
      ? priceLists.map(pl => pl._id)
      : [...new Set(
          (values.lineItems || [])
            .map(li => li.selectedPriceListId)
            .filter(Boolean)
        )];

    if (values.priceListId && !plIds.includes(values.priceListId)) {
      plIds.push(values.priceListId);
    }

    if (plIds.length === 0) return;

    plIds.forEach(plId => loadSnapshot(plId));
  }, [priceLists, loadingLists]);

  const selectPriceList = useCallback(async (plId) => {
    if (!plId) return;
    await loadSnapshot(plId);
    setFieldValue("priceListId", plId);
    const cached = snapshotCache[plId];
    if (cached?.meta) {
      setFieldValue("snapshotVersion", cached.meta.snapshotVersion);
    }
  }, [loadSnapshot, snapshotCache, setFieldValue]);

  const items = useMemo(() => {
    const all = [];
    Object.values(snapshotCache).forEach(({ items: snapItems }) => {
      snapItems.forEach(p => {
        all.push({
          value: String(p.value),
          label: p.label,
          image: p.image || "",
          title: p.caption,
          desc: p.desc || p.caption,
          currency: p.currency,
          makeId: String(p.makeId),
          makeName: p.makeName,
          variants: p.variants || [],
          options: p.options || [],
          priceListId: p._priceListId,
        });
      });
    });
    return all;
  }, [snapshotCache]);

  useEffect(() => {
    if (!items.length) return;
    (values.lineItems || []).forEach((li, idx) => {
      if (!li?.productValue || li.selectedPriceListId) return;
      const found = items.find(i => i.value === String(li.productValue));
      if (found?.priceListId) {
        setFieldValue(`lineItems.${idx}.selectedPriceListId`, found.priceListId);
      }
    });
  }, [items, values.lineItems]);

  const getItemsByPriceList = useCallback((plId) => {
    return items.filter(i => i.priceListId === plId);
  }, [items]);

  const makes = useMemo(() => {
    const map = {};
    items.forEach((p) => {
      if (p.makeId && !map[p.makeId]) {
        map[p.makeId] = { value: p.makeId, label: p.makeName };
      }
    });
    return Object.values(map);
  }, [items]);

  const priceListOptions = useMemo(() =>
    priceLists.map((pl) => ({
      value: pl._id,
      label: pl.title,
      makeName: pl.make?.name || "",
      makeLogo: pl.make?.logo || "",
      currency: pl.currency,
    })),
    [priceLists]
  );

  return {
    items,
    makes,
    loading: loadingLists || loadingSnapshot,
    loadingLists,
    loadingSnapshot,
    priceLists: priceListOptions,
    selectPriceList,
    getItemsByPriceList,
    snapshotCache,
  };
}
