"use client";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import FormFields from "./FormFields";
import FormSaveButton from "@/components/formSaveButton";
import MessageBlock from "@/components/messageBlock";
import DebugJson from "@/components/DebugJson";
import axios from "@/utils/axios";

const DEFAULT_VALUES = {
  docType: "Teklif",
  search: "",
  companyId: "",
  contactId: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  title: "",
  vatTitle: "",
  email: "",
  domain: "",
  line1: "",
  line2: "",
  district: "",
  city: "",
  country: "",
  lineItems: [{
    title: "",
    priceList: "",
    priceOffer: "",
    priceNet: "",
    currency: "",
    productValue: "",
    condition: "",
    image: "",
    caption: "",
    notes: "",
    quantity: 1,
    options: [],
    selectedOptions: [],
    selectedMakeId: "",
    selectedVariantId: "",
  }],
  vatRate: 20,
  showVat: true,
  showTotals: true,
};

function mapOfferToForm(offer) {
  const lastVersion = offer.versions[offer.versions.length - 1];
  const co = offer.company || {};
  const addr = co.addresses?.[0] || {};

  return {
    _id: offer._id,
    docType: offer.docType || "Teklif",
    search: "",
    companyId: co._id || "",
    title: co.title || "",
    vatTitle: co.vatTitle || "",
    email: co.emails?.[0] || "",
    domain: co.domains?.[0] || "",
    line1: addr.line1 || "",
    line2: addr.line2 || "",
    district: addr.district || "",
    city: addr.city || "",
    country: addr.country || "",
    contactId: offer.contact?._id || "",
    contactName: offer.contact?.name || "",
    contactPhone: offer.contact?.phones?.[0] || "",
    contactEmail: offer.contact?.emails?.[0] || "",
    vatRate: lastVersion?.vatRate ?? 20,
    showVat: lastVersion?.showVat ?? true,
    showTotals: lastVersion?.showTotals ?? true,
    lineItems: (lastVersion?.lineItems || []).map((item) => ({
      title: item.title || "",
      productValue: item.productValue || "",
      selectedMakeId: "",
      selectedVariantId: item.variantId || "",
      options: [],
      selectedOptions: (item.selectedOptions || []).map((o) => ({
        value: o.optionId,
        label: "",
        listPrice: o.listPrice,
        offerPrice: o.offerPrice,
        netPrice: o.netPrice,
        currency: o.currency,
        desc: o.desc,
        quantity: o.quantity,
      })),
      priceList: item.priceList || "",
      priceOffer: item.priceOffer || "",
      priceNet: item.priceNet || "",
      variantPriceList: item.priceList || 0,
      variantPriceOffer: item.priceOffer || 0,
      variantPriceNet: item.priceNet || 0,
      currency: item.currency || "",
      quantity: item.quantity || 1,
      notes: item.notes || "",
      condition: item.condition || "",
      image: "",
      caption: "",
    })),
  };
}

const NewForm = ({ offerId }) => {
  const [message, setMessage] = useState(null);
  const [initialValues, setInitialValues] = useState(DEFAULT_VALUES);
  const [loading, setLoading] = useState(!!offerId);

  useEffect(() => {
    if (!offerId) return;
    (async () => {
      try {
        const { data } = await axios.get(`/api/offer/${offerId}`);
        if (data.success) setInitialValues(mapOfferToForm(data.record));
      } catch (err) {
        setMessage({ type: "error", text: "Teklif yüklenemedi." });
      } finally {
        setLoading(false);
      }
    })();
  }, [offerId]);

  if (loading) return <div className="text-stone-400 py-8 text-center">Yükleniyor...</div>;

  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          try {
            const { data } = await axios.post("/api/offer", values);
            if (data.success) {
              setMessage({
                text: data.message || "Başarıyla Kaydedildi",
                type: "success",
              });
            }
          } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Hata oluştu" });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form autoComplete="off">
            <FormFields />
            <MessageBlock message={message} />
            <FormSaveButton isSubmitting={isSubmitting} />
            <DebugJson data={values} />
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default NewForm;
