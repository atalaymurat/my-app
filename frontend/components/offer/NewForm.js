"use client";
import { useState, useEffect } from "react";
import axiosOrg from "@/utils/axiosOrg";
import axios from "@/utils/axios";
import OfferFormWizard from "./OfferFormWizard";
import { DEFAULT_VALUES } from "./formConfig";

export default function NewForm() {
  const [initialValues, setInitialValues] = useState(DEFAULT_VALUES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosOrg
      .get("/me")
      .then(({ data }) => {
        setInitialValues((prev) => ({
          ...prev,
          offerTerms: data.offerDefaults || [],
        }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <OfferFormWizard
      initialValues={initialValues}
      loading={loading}
      successMessage="Teklif oluşturuldu."
      onSubmit={async (values) => {
        const { data } = await axios.post("/api/offer", values);
        return data;
      }}
    />
  );
}
