"use client";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import FormFields from "./FormFields";
import FormSaveButton from "@/components/formSaveButton";
import MessageBlock from "@/components/messageBlock";
import axios from "@/utils/axios";
import * as Yup from "yup";

const validationSchema = Yup.object({
  title: Yup.string().required("Gerekli"),
  make: Yup.string().required("Marka seçiniz"),
  masterProducts: Yup.array().min(1, "En az bir master ürün seçiniz"),
});

const EMPTY_VALUES = {
  title: "",
  masterProducts: [],
  make: "",
  description: "",
  currency: "TRY",
  priceNet: "",
  priceList: "",
  priceOffer: "",
  image: "",
};

const OptionForm = ({ option }) => {
  const [message, setMessage] = useState(null);
  const [makes, setMakes] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (option) setEditMode(true);
  }, [option]);

  useEffect(() => {
    // Sadece masterProduct'u olan markaları getir
    axios.get("/api/master").then(({ data }) => {
      if (data.success) {
        const makeMap = {};
        (data.products || data.masters || []).forEach((m) => {
          if (m.make) makeMap[m.make._id || m.make] = m.make.name || m.make;
        });
        setMakes(Object.entries(makeMap).map(([id, name]) => ({ value: id, label: name })));
      }
    });
  }, []);

  const initialValues = editMode
    ? {
        title: option.title || "",
        masterProducts: option.masterProducts || [],
        make: option.make?._id || option.make || "",
        description: option.description || "",
        currency: option.currency || "TRY",
        priceNet: option.priceNet || "",
        priceList: option.priceList || "",
        priceOffer: option.priceOffer || "",
        image: option.image || "",
      }
    : EMPTY_VALUES;

  if (!makes) return <div className="text-stone-400 text-sm">Yükleniyor...</div>;

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        setMessage(null);
        try {
          if (editMode) {
            const { data } = await axios.patch(`/api/option/${option._id}`, values);
            if (data.success) setMessage({ text: "Başarıyla Güncellendi", type: "success" });
            else setMessage({ text: data.message || "Bir hata oluştu.", type: "error" });
          } else {
            const { data } = await axios.post("/api/option", values);
            if (data.success) {
              setMessage({ text: data.message || "Başarıyla Kaydedildi", type: "success" });
              resetForm();
            } else {
              setMessage({ text: data.message || "Bir hata oluştu.", type: "error" });
            }
          }
        } catch (err) {
          setMessage({ text: err.response?.data?.message || "Bir hata oluştu.", type: "error" });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form autoComplete="off">
          <FormFields makes={makes} />
          <MessageBlock message={message} />
          <FormSaveButton isSubmitting={isSubmitting} />
        </Form>
      )}
    </Formik>
  );
};

export default OptionForm;
