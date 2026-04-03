import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "@/utils/axios";
import { useState, useEffect } from "react";
import EmailFields from "../formik/emailFields";
import PhoneFields from "../formik/phoneFields";
import FormFields from "./formFields";
import MessageBlock from "../messageBlock";
import FormSaveButton from "../formSaveButton";

const validationSchema = Yup.object({
  name: Yup.string().required("Gerekli"),
  gender: Yup.string().required("Gerekli"),
  phones: Yup.array()
    .of(Yup.string().required("Telefon numarası gerekli"))
    .max(3, "En fazla 3 telefon numarası ekleyebilirsiniz"),
  emails: Yup.array()
    .of(Yup.string().email("Geçersiz email").required("Email gerekli"))
    .max(3, "En fazla 3 email adresi ekleyebilirsiniz"),
});

const EMPTY_VALUES = {
  name: "",
  gender: "none",
  emails: [""],
  phones: ["90:"],
};

const ContactForm = ({ contact }) => {
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (contact) setEditMode(true);
  }, [contact]);

  const initialValues = editMode
    ? {
        name: contact.name || "",
        gender: contact.gender || "none",
        emails: contact.emails?.length ? contact.emails : [""],
        phones: contact.phones?.length ? contact.phones : ["90:"],
      }
    : EMPTY_VALUES;

  return (
    <>
      <div className="w-full px-2 max-w-4xl mx-auto">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setMessage(null);
            setSubmitting(true);
            const payload = {
              ...values,
              phones: values.phones.filter(p => p && p !== "90:").map(p => {
                if (p.includes(":")) {
                  const [cc, local] = p.split(":");
                  return (cc || "") + (local || "");
                }
                return p.replace(/\D/g, "");
              }).filter(Boolean),
            };
            try {
              if (editMode) {
                const response = await axios.patch(`/api/contact/${contact._id}`, payload);
                if (response.data) {
                  setMessage({ text: "Başarıyla Güncellendi", type: "success" });
                }
              } else {
                const response = await axios.post("/api/contact", payload);
                if (response.data.success) {
                  setMessage({ text: response.data.message || "Başarıyla Kaydedildi", type: "success" });
                  resetForm();
                } else {
                  setMessage({ text: response.data.message || "Bir hata oluştu.", type: "error" });
                }
              }
            } catch (error) {
              setMessage({ text: error.response?.data?.message || "Bir hata oluştu.", type: "error" });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form autoComplete="off">
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

export default ContactForm;
