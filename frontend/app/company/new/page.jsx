"use client";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Formik, Form, FieldArray } from "formik";
import FormSaveButton from "@/components/formSaveButton";
import MessageBlock from "@/components/messageBlock";
import apiClient from "@/lib/apiClient";
import Phones from "@/components/company/phones";
import EmailFields from "@/components/company/EmailFields";
import DomainFields from "@/components/company/DomainFields";

import WebUrlWithMeta from "@/components/company/WebUrlWithMeta";
import { companyValidationSchema } from "@/components/company/validationSchema";
import AddressFields from "@/components/company/AddressFields";
import FormFields from "@/components/company/FormFields";

export default function NewCompany() {
  const { user, loading, checkSession, authChecked } = useAuth();
  const router = useRouter();
  const [metadata, setMetadata] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const verifySession = async () => {
      if (!authChecked) {
        const sessionUser = await checkSession();
        if (!sessionUser) {
          router.push("/auth");
        }
      }
    };
    verifySession();
  }, [authChecked, checkSession, router]);

  if (loading) {
    return <div className="p-8">Loading authentication status...</div>;
  }
  if (!user) {
    router.push("/auth");
    return null;
  }

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

          const processedValues = { ...values };

          const { data } = await apiClient.post(
            "/api/company",
            processedValues
          );
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
