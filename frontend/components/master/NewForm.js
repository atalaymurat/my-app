"use client";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import FormFields from "./FormFields";
import FormSaveButton from "@/components/formSaveButton";
import MessageBlock from "@/components/messageBlock";
import axios from "@/utils/axios";

const NewForm = () => {
  const [message, setMessage] = useState(null);
  const [options, setOptions] = useState([]);
  const [makes, setMakes] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        setLoadingOptions(true);
        const { data } = await axios.get("/api/make");
        console.log("Makes :::", data);

        if (data.success) {
          const formatted = data.makes.map((item) => ({
            value: item._id,
            label: item.name,
          }));

          setMakes(formatted);
        }
      } catch (err) {
        console.error("Makes fetch error:", err);
      } finally {
        setLoadingOptions(false);
      }
    };
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        const { data } = await axios.get("/api/option");
        console.log("Optıons :::", data);

        if (data.success) {
          const formatted = data.options.map((opt) => ({
            value: opt._id,
            label: opt.title,
          }));

          setOptions(formatted);
        }
      } catch (err) {
        console.error("Options fetch error:", err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchMakes();
  }, []);

  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={{
          caption: "",
          make: "",
          model: "",
          year: "",
          condition: "",
          currency: "EUR",
          options: [],
          variants: [
            {
              modelType: "",
              code: "",
              priceNet: "",
              priceOffer: "",
              priceList: "",
              stock: "",
              technicalSpecs: [
                {
                  key: "",
                  value: "",
                },
              ],
            },
          ],
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          console.log(
            "Form submitted with values:",
            JSON.stringify(values, null, 2),
          );
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
            <FormFields
              options={options}
              loading={loadingOptions}
              makes={makes}
            />
            <MessageBlock message={message} />
            <FormSaveButton isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default NewForm;
