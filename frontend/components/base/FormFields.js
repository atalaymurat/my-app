"use client";
import FormikControl from "../formik/FormikControl";

const FormFields = () => {
  return (
    <>
      <FormikControl
        control="input"
        type="text"
        label="Baslik"
        name="title"
      />
      <FormikControl
        control="input"
        type="text"
        label="Aciklama"
        name="description"
      />
    </>
  );
};
export default FormFields;
