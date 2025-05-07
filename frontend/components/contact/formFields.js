import FormikControl from "../formik/FormikControl";

export default function FormFields() {
  return (
    <>
      <FormikControl control="input" type="text" label="İsim" name="name" />
      <FormikControl
        control="checkboxSingle"

        label="Cinsiyet"
        options={[
          { label: "Erkek", value: "male" },
          { label: "Kadın", value: "female" },
          { label: "Belirtilmemiş", value: "none" },
        ]}
        name="gender"
      />
    </>
  );
}
