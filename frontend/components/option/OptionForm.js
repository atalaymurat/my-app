"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import FormFields from "./FormFields";
import FormSaveButton from "@/components/formSaveButton";
import MessageBlock from "@/components/messageBlock";
import axios from "@/utils/axios";
import { toSquareImage } from "@/utils/squareImage";

// currency kasıtlı boş — kullanıcı seçmeli
const EMPTY_VALUES = {
  title: "", make: "", description: "",
  currency: "", priceNet: "", priceList: "", priceOffer: "",
  image: "", products: [],
};

const validationSchema = Yup.object({
  title: Yup.string().required("Başlık zorunlu"),
  make: Yup.string().required("Marka seçimi zorunlu"),
  currency: Yup.string().required("Döviz seçimi zorunlu"),
  priceOffer: Yup.number().typeError("Geçerli fiyat girin").required("Teklif fiyatı zorunlu"),
});

function buildValidationMessage(errors) {
  const map = { title: "Başlık", make: "Marka", currency: "Döviz", priceOffer: "Teklif Fiyatı" };
  const fields = Object.keys(map).filter(k => errors[k]).map(k => map[k]);
  return { text: "Zorunlu alanlar eksik", detail: `Lütfen doldurun: ${fields.join(", ")}`, type: "error" };
}

function ValidationWatcher({ onFail }) {
  const { submitCount, isValid, errors } = useFormikContext();
  const prev = useRef(0);
  useEffect(() => {
    if (submitCount > prev.current && !isValid) {
      onFail(errors);
      document.querySelector("[data-field-error]")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    prev.current = submitCount;
  }, [submitCount, isValid]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

const OptionForm = ({ option }) => {
  const router = useRouter();
  const isEdit = !!option;
  const [message, setMessage] = useState(null);
  const [makes, setMakes] = useState([]);
  const [saveCount, setSaveCount] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(option?.image || null);
  const cloudinaryUrlRef = useRef(option?.image || null);

  const [initialValues, setInitialValues] = useState(() =>
    option ? {
      title: option.title || "", make: option.make?._id || option.make || "",
      description: option.description || "", currency: option.currency || "",
      priceNet: option.priceNet || "", priceList: option.priceList || "",
      priceOffer: option.priceOffer || "", image: option.image || "", products: [],
    } : EMPTY_VALUES
  );

  // Paralel veri çekimi — waterfall yok
  useEffect(() => {
    const requests = [axios.get("/api/make")];
    if (option?._id) requests.push(axios.get(`/api/master/byoption/${option._id}`));

    Promise.all(requests)
      .then(([makesRes, mastersRes]) => {
        if (makesRes.data.success)
          setMakes(makesRes.data.makes.map(m => ({ value: m._id, label: m.name, logo: m.logo })));
        if (mastersRes?.data.success)
          setInitialValues(prev => ({ ...prev, products: mastersRes.data.masterIds }));
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const deleteFromCloudinary = useCallback((url) => {
    if (!url?.includes("cloudinary")) return;
    axios.delete("/api/upload", { data: { url } }).catch(() => {});
  }, []);

  const handleImageChange = useCallback(async (file) => {
    const squared = await toSquareImage(file);
    setImageFile(squared);
    setImagePreview(URL.createObjectURL(squared));
  }, []);

  const handleImageRemove = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
  }, []);

  const handleValidationFail = useCallback((errors) => {
    setMessage(buildValidationMessage(errors));
  }, []);

  const handleSubmit = useCallback(async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      let imageUrl = values.image;
      const prevUrl = cloudinaryUrlRef.current;

      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const { data: up } = await axios.post("/api/upload?folder=options", fd);
        imageUrl = up.url;
        if (prevUrl && prevUrl !== imageUrl) deleteFromCloudinary(prevUrl);
        cloudinaryUrlRef.current = imageUrl;
      } else if (!imagePreview && prevUrl) {
        deleteFromCloudinary(prevUrl);
        cloudinaryUrlRef.current = null;
        imageUrl = "";
      }

      const payload = { ...values, image: imageUrl };
      if (isEdit) {
        const { data } = await axios.patch(`/api/option/${option._id}`, payload);
        if (data.success) setMessage({ text: "Opsiyon güncellendi", type: "success" });
      } else {
        const { data } = await axios.post("/api/option", payload);
        if (data.success) {
          setMessage({ text: "Opsiyon kaydedildi", type: "success" });
          setSaveCount(c => c + 1);
          resetForm({ values: EMPTY_VALUES });
          setImageFile(null);
          setImagePreview(null);
          cloudinaryUrlRef.current = null;
        }
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Sunucu hatası, tekrar deneyin", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }, [imageFile, imagePreview, isEdit, option?._id, deleteFromCloudinary]);

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form autoComplete="off">
          <ValidationWatcher onFail={handleValidationFail} />
          <FormFields
            makes={makes}
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onImageRemove={handleImageRemove}
          />
          <div className="px-4 sm:px-0 mt-4 space-y-2">
            <MessageBlock message={message} />
            <FormSaveButton isSubmitting={isSubmitting} />
            {/* Kayıt başarılıysa geri butonu göster (create modda) */}
            {!isEdit && saveCount > 0 && (
              <button type="button" onClick={() => router.back()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-600 hover:border-stone-400 bg-stone-800/50 hover:bg-stone-800 text-sm font-semibold text-stone-400 hover:text-stone-200 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Geri Dön
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default OptionForm;
