"use client";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import FormFields from "./FormFields";
import FormSaveButton from "@/components/formSaveButton";
import MessageBlock from "@/components/messageBlock";
import axios from "@/utils/axios";

const NewForm = () => {
  const [message, setMessage] = useState(null);
  const [baseProducts, setBaseProducts] = useState(null);

  useEffect(() => {
    const fetchBaseProducts = async () => {
      try {
        const { data } = await axios.get("/api/base-product/list");
        if (data.success) {
          setBaseProducts(data.list);
          console.log("Base products fetched successfully:", data.list);
        }
      } catch (error) {
        console.error("Error fetching base products:", error);
      }
    };
    fetchBaseProducts();
  }, []);

  if (baseProducts !== null) {
    return (
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={{
            title: "",
            baseProducts: [],
            description: "",
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
            console.log("Form submitted with values:", JSON.stringify(values));
            try {
              const { data } = await axios.post("/api/option", values);
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
              <FormFields baseProducts={baseProducts} />
              <MessageBlock message={message} />
              <FormSaveButton isSubmitting={isSubmitting} />
            </Form>
          )}
        </Formik>
      </div>
    );
  }
};
export default NewForm;
