"use client";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import FormFields from "./FormFields";
import FormSaveButton from "@/components/formSaveButton";
import MessageBlock from "@/components/messageBlock";
import axios from "@/utils/axios";

const DEFAULT_VALUES = {
  caption: "", make: "", model: "", year: "", condition: "", currency: "EUR", options: [],
  variants: [{ modelType: "", code: "", priceNet: "", priceOffer: "", priceList: "", stock: "", technicalSpecs: [{ key: "", value: "" }] }],
};

function mapMasterToForm(product) {
  return {
    caption: product.caption || "",
    make: product.make?._id || product.make || "",
    model: product.model || "",
    year: product.year || "",
    condition: product.condition || "",
    currency: product.currency || "EUR",
    options: product.options || [],
    variants: product.variants?.length > 0
      ? product.variants.map((v) => ({
          modelType: v.modelType || "",
          code: v.code || "",
          priceNet: v.priceNet ?? "",
          priceOffer: v.priceOffer ?? "",
          priceList: v.priceList ?? "",
          stock: v.stock ?? "",
          technicalSpecs: v.technicalSpecs?.length > 0 ? v.technicalSpecs : [{ key: "", value: "" }],
        }))
      : DEFAULT_VALUES.variants,
  };
}

const NewForm = ({ masterId }) => {
  const [message, setMessage] = useState(null);
  const [makes, setMakes] = useState([]);
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [initialValues, setInitialValues] = useState(DEFAULT_VALUES);

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        setLoadingMakes(true);
        const { data } = await axios.get("/api/make");
        if (data.success) setMakes(data.makes.map((m) => ({ value: m._id, label: m.name })));
      } catch { /* ignore */ }
      finally { setLoadingMakes(false); }
    };
    fetchMakes();
  }, []);

  useEffect(() => {
    if (!masterId) return;
    const fetchMaster = async () => {
      try {
        const { data } = await axios.get(`/api/master/${masterId}`);
        if (data.success) setInitialValues(mapMasterToForm(data.product));
      } catch { /* ignore */ }
    };
    fetchMaster();
  }, [masterId]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      const { data } = masterId
        ? await axios.put(`/api/master/${masterId}`, values)
        : await axios.post("/api/master", values);
      if (data.success) {
        setMessage({ text: data.message || "Başarıyla Kaydedildi", type: "success" });
      }
    } catch {
      setMessage({ text: "Bir hata oluştu", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Formik enableReinitialize={true} initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form autoComplete="off">
            <FormFields loading={loadingMakes} makes={makes} />
            <MessageBlock message={message} />
            <FormSaveButton isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default NewForm;
