import FormikControl from "../formik/FormikControl";

const FormFields = () => {
  return (
    <>
      <FormikControl
        control="input"
        type="text"
        label="Kısa Ünvan"
        name="title"
      />
      <FormikControl
        control="input"
        type="text"
        label="Tam Ünvan"
        name="vatTitle"
      />
      <FormikControl
        control="input"
        type="text"
        label="Vergi Dairesi"
        name="vd"
      />
      <FormikControl
        control="mask"
        type="text"
        label="Vergi No"
        name="vatNo"
        mask="___ ___ __ __"
        replacement={{ _: /\d/ }} // Only numbers allowed
      />
      <FormikControl
        control="mask"
        type="text"
        label="Şahıs Tc No"
        name="tcNo"
        mask="___ ___ ___ __"
        replacement={{ _: /\d/ }} // Only numbers allowed
      />
    </>
  );
};


export default FormFields;