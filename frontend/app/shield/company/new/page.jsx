"use client";
import { useState } from "react";
import { Formik, Form } from "formik";
import FormSaveButton from "@/components/formSaveButton";
import MessageBlock from "@/components/messageBlock";
import axios from "@/utils/axios";
import EmailFields from "@/components/formik/emailFields";
import DomainFields from "@/components/company/DomainFields";

import WebUrlWithMeta from "@/components/company/WebUrlWithMeta";
import { companyValidationSchema } from "@/components/company/validationSchema";
import AddressFields from "@/components/company/AddressFields";
import FormFields from "@/components/company/FormFields";

export default function NewCompany() {
  const [metadata, setMetadata] = useState(null);
  const [message, setMessage] = useState(null);

  return (
    <div className="p-8 flex flex-col gap-4">
      <div className="font-bold text-2xl">
        Firma veya Şahıs Şirket Kaydı Oluştur...
      </div>
      <Formik
        enableReinitialize
        initialValues={{
          title: "",
          vatTitle: "",
          phones: [""],
          emails: [""],
          vd: "",
          vatNo: "",
          tcNo: "",
          domains: [""],
          favicon: "",
          ogImage: "",
          description: "",
          addresses: [
            {
              title: "",
              line1: "",
              line2: "",
              district: "",
              city: "",
              country: "Tr",
              zip: "",
              raw: "",
            },
          ],
        }}
        validationSchema={companyValidationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);

          const { data } = await axios.post("/api/company", values);
          if (data.success) {
            setMessage({
              text: data.message || "Başarıyla Kaydedildi",
              type: "success",
            });
            // time to show message for 2 seconds
            setTimeout(() => {
              setMessage(null);
              // resetForm();
            }, 3000);
            // redirect to company page
            //router.push("/company");
          }
          if (!data.success) {
            setMessage({ type: "error", text: data.message });
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form autoComplete="off">
            <DomainFields />
            <WebUrlWithMeta
              metadata={metadata}
              setMetadata={setMetadata}
              setMessage={setMessage}
            />

            <FormFields />
            <EmailFields />

            <AddressFields />

            <MessageBlock message={message} />
            <FormSaveButton isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>
    </div>
  );
}
