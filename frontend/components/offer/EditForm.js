"use client";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import OfferFormWizard from "./OfferFormWizard";
import { DEFAULT_VALUES, mapOfferToForm } from "./formConfig";

function createSnapshotEntry(plId, data) {
  const snapshotItems = (data.list || []).map((product) => ({
    ...product,
    _priceListId: plId,
  }));

  return {
    items: snapshotItems,
    meta: {
      priceListId: data.priceListId || plId,
      snapshotVersion: data.snapshotVersion,
      makeName: data.makeName,
    },
  };
}

function findProduct(snapshotCache, priceListId, productValue) {
  const targetValue = String(productValue);
  const caches = priceListId
    ? [snapshotCache[priceListId]].filter(Boolean)
    : Object.values(snapshotCache);

  for (const cache of caches) {
    const match = cache.items.find((item) => String(item.value) === targetValue);
    if (match) return match;
  }

  return null;
}

export default function EditForm({ offerId }) {
  const [initialValues, setInitialValues] = useState(DEFAULT_VALUES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await axios.get(`/api/offer/${offerId}`);
        if (!data.success) throw new Error("Teklif yüklenemedi.");

        const mapped = mapOfferToForm(data.record);
        const priceListIds = [
          ...new Set(
            [mapped.priceListId, ...mapped.lineItems.map((item) => item.selectedPriceListId)].filter(Boolean),
          ),
        ];

        const snapshotEntries = await Promise.all(
          priceListIds.map(async (plId) => {
            const response = await axios.get(`/api/price-list/${plId}/snapshot/active`);
            return [plId, createSnapshotEntry(plId, response.data)];
          }),
        );

        const snapshotCache = Object.fromEntries(snapshotEntries);

        const lineItems = await Promise.all(
          mapped.lineItems.map(async (item) => {
            const product = findProduct(snapshotCache, item.selectedPriceListId, item.productValue);
            let options = product?.options || [];

            if (!options.length && item.productValue) {
              try {
                const { data: optData } = await axios.get(`/api/option/list/${item.productValue}`);
                options = optData.list || [];
              } catch {
                options = [];
              }
            }

            return {
              ...item,
              selectedMakeId: product?.makeId || item.selectedMakeId || "",
              makeName: product?.makeName || item.makeName || "",
              currency: product?.currency || item.currency || "",
              options,
            };
          }),
        );

        if (!mounted) return;

        setInitialValues({
          ...mapped,
          lineItems,
          __initialSnapshotCache: snapshotCache,
        });
      } catch {
        if (!mounted) return;
        setInitialValues(DEFAULT_VALUES);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [offerId]);

  return (
    <OfferFormWizard
      initialValues={initialValues}
      loading={loading}
      successMessage="Teklif güncellendi."
      onSubmit={async (values) => {
        const { data } = await axios.patch(`/api/offer/${offerId}/offer-terms`, values);
        return data;
      }}
    />
  );
}
