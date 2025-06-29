"use client";
import { useState } from "react";
import { Formik, Form } from "formik";
import FormFields from "./FormFields";
import FormSaveButton from "@/components/formSaveButton";
import MessageBlock from "@/components/messageBlock";
import axios from "@/utils/axios";

const NewForm = () => {
  const [message, setMessage] = useState(null);

  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={{
          docType: "Teklif",
          search: "",
          companyId: "",
          title: "",
          vatTitle: "",
          email: "",
          domain: "",
          line1: "",
          line2: "",
          district: "",
          city: "",
          country: "",
          lineItems: [
            {
              title: "",
              priceList: "",
              priceNet: "",
              currencyList: "",
              currencyNet: "",
              productVariant: "",
              productValue: "",
              make: "",
              year: "",
              condition: "",
              createdFromMaster: false,
              image: "",
              raw: "",
              desc: "",
              options: [],
              notes: "",
              quantity: 1,
            },
          ],
          vatRate: 20,
          showVat: true,
          showTotals: true,
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          console.log("Form submitted with values:", JSON.stringify(values));
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
            console.log("Error during form submission:", err);
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form autoComplete="off">
            <FormFields />
            <MessageBlock message={message} />
            <FormSaveButton isSubmitting={isSubmitting} />
            <pre className="text-white">{JSON.stringify(values, null, 2)}</pre>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default NewForm;
