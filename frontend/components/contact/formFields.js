import FormikControl from "../formik/FormikControl";

export default function FormFields() {
  return (
    <>
      <FormikControl control="input" type="text" label="Ad" name="givenName" />
      <FormikControl control="input" type="text" label="İkinci Ad" name="middleName" />
      <FormikControl control="input" type="text" label="Soyad" name="familyName" />
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
