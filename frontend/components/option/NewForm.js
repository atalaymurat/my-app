"use client";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import FormFields from "./FormFields";
import FormSaveButton from "@/components/formSaveButton";
import MessageBlock from "@/components/messageBlock";
import axios from "@/utils/axios";
import { toSquareImage } from "@/utils/squareImage";

const INITIAL = {
  title: "", make: "", description: "",
  currency: "TRY", priceNet: "", priceList: "", priceOffer: "", image: "",
};

const NewForm = () => {
  const [message, setMessage] = useState(null);
  const [makes, setMakes] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    axios.get("/api/make")
      .then(({ data }) => {
        if (data.success) setMakes(data.makes.map((m) => ({ value: m._id, label: m.name, logo: m.logo })));
      })
      .catch(() => {});
  }, []);

  const handleImageChange = async (file) => {
    const squared = await toSquareImage(file);
    setImageFile(squared);
    setImagePreview(URL.createObjectURL(squared));
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      let imageUrl = values.image;
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const { data: up } = await axios.post("/api/upload?folder=options", fd);
        imageUrl = up.url;
      }
      const { data } = await axios.post("/api/option", { ...values, image: imageUrl });
      if (data.success) {
        setMessage({ text: "Başarıyla Kaydedildi", type: "success" });
        resetForm();
        setImageFile(null);
        setImagePreview(null);
      }
    } catch {
      setMessage({ text: "Bir hata oluştu", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik enableReinitialize initialValues={INITIAL} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form autoComplete="off">
          <FormFields
            makes={makes}
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onImageRemove={() => { setImageFile(null); setImagePreview(null); }}
          />
          <div className="px-4 sm:px-0 mt-4">
            <MessageBlock message={message} />
            <FormSaveButton isSubmitting={isSubmitting} />
          </div>
        </Form>
      )}
    </Formik>
  );
};
export default NewForm;
