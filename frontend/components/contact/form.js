import { Formik, Form, FieldArray, useFormikContext } from "formik";
import * as Yup from "yup";
import axios from "axios";

import { useState } from "react";
import EmailFields from "./emailFields";
import PhoneFields from "./phoneFields";
import FormFields from "./formFields";
import MessageBlock from "../messageBlock";
import FormSaveButton from "../formSaveButton";

const validationSchema = Yup.object({
  name: Yup.string().required("Gerekli"),
  gender: Yup.string().required("Gerekli"),
  phones: Yup.array()
    .of(
      Yup.object().shape({
        type: Yup.string(),
        number: Yup.string(),
        isPrimary: Yup.boolean(),
      })
    )
    .min(1, "En az bir telefon numarası gereklidir"),
});

const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BACKEND_URL // Make sure this env var is set in production
      : "http://localhost:5000", // Your backend URL for development
  withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
  },
});

const NewForm = () => {
  const [message, setMessage] = useState(null);
  return (
    <>
      <div className="px-2 max-w-4xl mx-auto">
        <Formik
          enableReinitialize
          initialValues={{
            name: "",
            gender: "none",
            emails: [{ address: "", isPrimary: false }],
            phones: [{ type: "other", number: "", isPrimary: false }],
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setMessage(null);
            console.log("Form Values", JSON.stringify(values, null, 2));
            setSubmitting(true);
            // make api call to create new contact
            try {
              const response = await apiClient.post("/api/contact", values);
              console.log("CONTACTS RESPONSE", response.data);
              if (response.data.success) {
                setMessage({
                  text: response.data.message || "Başarıyla Kaydedildi",
                  type: "success",
                });
                resetForm();
              } else {
                setMessage({
                  text: response.data.message + "Bir hata oluştu.",
                  type: "error",
                });
              }
            } catch (error) {
              console.error("Error creating contact:", error);
              setMessage({
                text: error.response?.data?.message || "Bir hata oluştu.",
                type: "error",
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form autoComplete="false">
              <FormFields />
              <PhoneFields />
              <EmailFields />

              <MessageBlock message={message} />
              <FormSaveButton isSubmitting={isSubmitting} />
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default NewForm;
