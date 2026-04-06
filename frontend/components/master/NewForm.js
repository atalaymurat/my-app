"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import FormFields from "./FormFields";
import FormSaveButton from "@/components/formSaveButton";
import MessageBlock from "@/components/messageBlock";
import axios from "@/utils/axios";
import { toSquareImage } from "@/utils/squareImage";

const DEFAULT_VALUES = {
  image: "", caption: "", make: "", model: "", year: "", currency: "EUR", options: [],
  variants: [{ modelType: "", code: "", priceNet: "", priceOffer: "", priceList: "", technicalSpecs: [{ key: "", value: "" }] }],
};

const variantSchema = Yup.object({
  priceOffer: Yup.number().typeError("Geçerli fiyat girin").required("Teklif fiyatı zorunlu"),
});

const validationSchema = Yup.object({
  make: Yup.string().required("Marka zorunlu"),
  model: Yup.string().required("Model ailesi zorunlu"),
  caption: Yup.string().required("Alt başlık zorunlu"),
  currency: Yup.string().required("Döviz zorunlu"),
  variants: Yup.array().of(variantSchema),
});

// Hata alanlarını okunabilir mesaja çevirir
function buildValidationMessage(errors) {
  const fields = [];
  if (errors.make) fields.push("Marka");
  if (errors.model) fields.push("Model Ailesi");
  if (errors.caption) fields.push("Alt Başlık");
  if (errors.currency) fields.push("Döviz");
  if (errors.variants?.some?.(v => v?.priceOffer)) fields.push("Teklif Fiyatı");
  return {
    text: "Zorunlu alanlar eksik",
    detail: `Lütfen şu alanları doldurun: ${fields.join(", ")}`,
    type: "error",
  };
}

// Formik submit denemesini izler; validation fail olunca callback çağırır
function ValidationWatcher({ onFail }) {
  const { submitCount, isValid, errors } = useFormikContext();
  const prevCount = useRef(0);
  useEffect(() => {
    if (submitCount > prevCount.current && !isValid) {
      onFail(errors);
    }
    prevCount.current = submitCount;
  }, [submitCount, isValid]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

function mapMasterToForm(product) {
  return {
    image: product.image || "",
    caption: product.caption || "",
    make: product.make?._id || product.make || "",
    model: product.model || "",
    year: product.year || "",
    currency: product.currency || "EUR",
    options: (product.options || []).map(o => o._id?.toString() || o.toString()),
    variants: product.variants?.length > 0
      ? product.variants.map((v) => ({
          modelType: v.modelType || "",
          code: v.code || "",
          priceNet: v.priceNet ?? "",
          priceOffer: v.priceOffer ?? "",
          priceList: v.priceList ?? "",
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
  // Cloudinary'de kayıtlı güncel URL — save başarılı olduktan sonra güncellenir
  const cloudinaryUrlRef = useRef(null);

  useEffect(() => {
    setLoadingMakes(true);
    axios.get("/api/make")
      .then(({ data }) => {
        if (data.success) setMakes(data.makes.map((m) => ({ value: m._id, label: m.name, logo: m.logo })));
      })
      .catch(() => {})
      .finally(() => setLoadingMakes(false));
  }, []);

  useEffect(() => {
    if (!masterId) return;
    axios.get(`/api/master/${masterId}`)
      .then(({ data }) => {
        if (data.success) {
          setInitialValues(mapMasterToForm(data.product));
          if (data.product.image) {
            setImagePreview(data.product.image);
            cloudinaryUrlRef.current = data.product.image;
          }
        }
      })
      .catch(() => {});
  }, [masterId]);

  // Cloudinary'den sil — fire-and-forget, save sonrası çağrılır
  const deleteFromCloudinary = useCallback((url) => {
    if (!url || !url.includes("cloudinary")) return;
    axios.delete("/api/upload", { data: { url } }).catch(() => {});
  }, []);

  const handleImageChange = useCallback(async (file) => {
    const squared = await toSquareImage(file);
    setImageFile(squared);
    setImagePreview(URL.createObjectURL(squared));
    // Eski URL'i silme; save başarılı olunca handleSubmit içinde silineceğiz
  }, []);

  const handleImageRemove = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    // Cloudinary silmesi save başarılı olunca yapılacak (pending işaret)
    // Burada sadece imageFile null → submit'te imageUrl = "" gider, backend temizler
  }, []);

  const handleMakeCreated = useCallback((newMake) => {
    setMakes(prev => [...prev, newMake]);
  }, []);

  const handleValidationFail = useCallback((errors) => {
    setMessage(buildValidationMessage(errors));
    // Sayfanın üstüne scroll — ilk hatalı alana yönlendir
    const firstError = document.querySelector("[data-field-error]");
    if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleSubmit = useCallback(async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      let imageUrl = values.image;
      const prevCloudinaryUrl = cloudinaryUrlRef.current;

      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const { data: up } = await axios.post("/api/upload?folder=products", fd);
        imageUrl = up.url;
        // Yeni görsel başarıyla yüklendi → artık eskiyi Cloudinary'den silebiliriz
        if (prevCloudinaryUrl && prevCloudinaryUrl !== imageUrl) {
          deleteFromCloudinary(prevCloudinaryUrl);
        }
        cloudinaryUrlRef.current = imageUrl;
      } else if (!imagePreview && prevCloudinaryUrl) {
        // Kullanıcı görseli kaldırdı ve yeni bir şey seçmedi
        deleteFromCloudinary(prevCloudinaryUrl);
        cloudinaryUrlRef.current = null;
        imageUrl = "";
      }

      const payload = { ...values, image: imageUrl };
      const { data } = masterId
        ? await axios.put(`/api/master/${masterId}`, payload)
        : await axios.post("/api/master", payload);

      if (data.success) {
        setMessage({ text: "Başarıyla kaydedildi", type: "success" });
        setImageFile(null); // artık file'a gerek yok
      }
    } catch {
      setMessage({ text: "Sunucu hatası, lütfen tekrar deneyin", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }, [imageFile, imagePreview, masterId, deleteFromCloudinary]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values }) => (
        <Form autoComplete="off">
          <ValidationWatcher onFail={handleValidationFail} />
          <FormFields
            loading={loadingMakes}
            makes={makes}
            isEdit={!!masterId}
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onImageRemove={handleImageRemove}
            onMakeCreated={handleMakeCreated}
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
