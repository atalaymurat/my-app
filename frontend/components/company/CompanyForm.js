import { useState, useEffect } from "react";
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

const EMPTY_ADDRESS = {
  title: "", line1: "", line2: "", district: "",
  city: "", country: "Tr", zip: "", raw: "",
};

const EMPTY_VALUES = {
  title: "", vatTitle: "", phones: [""], emails: [""],
  vd: "", vatNo: "", tcNo: "", domains: [""],
  favicon: "", ogImage: "", description: "",
  tags: [],
  addresses: [EMPTY_ADDRESS],
};

const CompanyForm = ({ company }) => {
  const [editMode, setEditMode] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (company) setEditMode(true);
  }, [company]);

  const initialValues = editMode
    ? {
        title: company.title || "",
        vatTitle: company.vatTitle || "",
        phones: company.phones?.length ? company.phones : [""],
        emails: company.emails?.length ? company.emails : [""],
        vd: company.vd || "",
        vatNo: company.vatNo || "",
        tcNo: company.tcNo || "",
        domains: company.domains?.length ? company.domains : [""],
        favicon: company.favicon || "",
        ogImage: company.ogImage || "",
        description: company.description || "",
        tags: company.tags || [],
        addresses: company.addresses?.length ? company.addresses : [EMPTY_ADDRESS],
      }
    : EMPTY_VALUES;

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={companyValidationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        setMessage(null);
        try {
          if (editMode) {
            const { data } = await axios.patch(`/api/company/${company._id}`, values);
            if (data.success) setMessage({ text: "Başarıyla Güncellendi", type: "success" });
            else setMessage({ text: data.message || "Bir hata oluştu.", type: "error" });
          } else {
            const { data } = await axios.post("/api/company", values);
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
  );
};

export default CompanyForm;
