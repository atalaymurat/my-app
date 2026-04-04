"use client";
import { useState, useEffect } from "react";
import { Formik, Form, useFormikContext } from "formik";
import FormFields from "./FormFields";
import FormSaveButton from "@/components/formSaveButton";
import MessageBlock from "@/components/messageBlock";
import axios from "@/utils/axios";

const DEFAULT_VALUES = {
  image: "", caption: "", make: "", model: "", year: "", condition: "", currency: "EUR", options: [],
  variants: [{ modelType: "", code: "", priceNet: "", priceOffer: "", priceList: "", stock: "", technicalSpecs: [{ key: "", value: "" }] }],
};

function mapMasterToForm(product) {
  return {
    image: product.image || "",
    caption: product.caption || "",
    make: product.make?._id || product.make || "",
    model: product.model || "",
    year: product.year || "",
    condition: product.condition || "",
    currency: product.currency || "EUR",
    options: (product.options || []).map(o => o._id?.toString() || o.toString()),
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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setLoadingMakes(true);
    axios.get("/api/make")
      .then(({ data }) => { if (data.success) setMakes(data.makes.map((m) => ({ value: m._id, label: m.name, logo: m.logo }))); })
      .catch(() => {})
      .finally(() => setLoadingMakes(false));
  }, []);

  useEffect(() => {
    if (!masterId) return;
    axios.get(`/api/master/${masterId}`)
      .then(({ data }) => {
        if (data.success) {
          setInitialValues(mapMasterToForm(data.product));
          if (data.product.image) setImagePreview(data.product.image);
        }
      })
      .catch(() => {});
  }, [masterId]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      let imageUrl = values.image;
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const { data: up } = await axios.post("/api/upload?folder=products", fd);
        imageUrl = up.url;
      }

      const payload = { ...values, image: imageUrl };
      const { data } = masterId
        ? await axios.put(`/api/master/${masterId}`, payload)
        : await axios.post("/api/master", payload);

      if (data.success) setMessage({ text: "Başarıyla Kaydedildi", type: "success" });
    } catch {
      setMessage({ text: "Bir hata oluştu", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
      {({ isSubmitting, values }) => (
        <Form autoComplete="off">
          <FormFields
            loading={loadingMakes}
            makes={makes}
            isEdit={!!masterId}
            imagePreview={imagePreview}
            onImageChange={(file) => { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }}
            onImageRemove={() => { setImageFile(null); setImagePreview(null); }}
          />
          <div className="px-4 sm:px-0 mt-4">
            <MessageBlock message={message} />
            <FormSaveButton isSubmitting={isSubmitting} />
          </div>
          {process.env.NODE_ENV !== "production" && (
            <pre className="mt-4 p-4 bg-stone-900 border border-stone-700 rounded-xl text-xs text-stone-400 overflow-auto max-h-64">
              {JSON.stringify(values, null, 2)}
            </pre>
          )}
        </Form>
      )}
    </Formik>
  );
};
export default NewForm;
