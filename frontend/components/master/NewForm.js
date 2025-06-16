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
          description: "",
          make: "",
          model: "",
          year: "",
          condition: "",
          isConfigurable: false,
          asItIs: true,
          priceNet: {
            currency: "TRY",
            value: "",
          },
          priceList: {
            currency: "TRY",
            value: "",
          },
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          console.log("Form submitted with values:", JSON.stringify(values, null , 2));
          try {
            const { data } = await axios.post("/api/master", values);
            if (data.success) {
              setMessage({
                text: data.message || "Başarıyla Kaydedildi",
                type: "success",
              });
            }
          } catch (err) {
            console.log("Error during form submission:", err);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form autoComplete="off">
            <FormFields />
            <MessageBlock message={message} />
            <FormSaveButton isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default NewForm;
