"use client";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import FormFields from "./FormFields";
import FormSaveButton from "@/components/formSaveButton";
import MessageBlock from "@/components/messageBlock";
import axios from "@/utils/axios";

const NewForm = () => {
  const [message, setMessage] = useState(null);
  const [makeList, setMakeList] = useState(null);

  useEffect(() => {
    const fetchMakeList = async () => {
      try {
        const { data } = await axios.get(`/api/master/make`);
        if (data.success) {
          setMakeList(data.makes);
        }
      } catch (error) {
        console.error("Error fetching make List:", error);
      }
    };
    fetchMakeList();
  }, []);

  if ( makeList) {
    return (
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={{
            title: "",
            masterProduct:"",
            make: makeList[0]?.value || "",
            options: [],
          }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            console.log("Form submitted with values:", JSON.stringify(values));
            try {
              const { data } = await axios.post("/api/configuration", values);
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
          {({ isSubmitting, values }) => (
            <Form autoComplete="off">
              <FormFields  makeList={makeList} />
              <MessageBlock message={message} />
              <FormSaveButton isSubmitting={isSubmitting} />
              <pre className="text-white">{JSON.stringify(values, null, 2)}</pre>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
};
export default NewForm;
