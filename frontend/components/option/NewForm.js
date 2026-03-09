"use client";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import FormFields from "./FormFields";
import FormSaveButton from "@/components/formSaveButton";
import MessageBlock from "@/components/messageBlock";
import axios from "@/utils/axios";

const NewForm = () => {
  const [message, setMessage] = useState(null);
  const [makes, setMakes] = useState(null);

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const { data } = await axios.get("/api/make");

        if (data.success) {
          const formatted = data.makes.map((mk) => ({
            value: mk._id,
            label: mk.name,
          }));
          setMakes(formatted);
        }
      } catch (error) {
        console.error("Error fetching base products:", error);
      }
    };
    fetchMakes();
  }, []);

  if (makes !== null) {
    return (
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={{
            title: "",
            masterProducts: [],
            make: "",
            description: "",
            currency: "TRY",
            priceNet: "",
            priceList: "",
            priceOffer: "",
            image: "",
          }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
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
              <FormFields makes={makes} />
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
