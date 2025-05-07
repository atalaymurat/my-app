import * as Yup from "yup";

export const companyValidationSchema = Yup.object({
  title: Yup.string().required("Gerekli").min(3, "Minimum 3 characters"),
  vatNo: Yup.string()
    .min(13, "Minimum 10 characters")
    .max(13, "Maximum 10 characters"),
  tcNo: Yup.string()
    .min(14, "Minimum 11 characters")
    .max(14, "Maximum 11 characters"),

  addresses: Yup.array().of(
    Yup.object().shape({
      city: Yup.string().required("Gerekli"),
      country: Yup.string().required("Gerekli"),
      zip: Yup.string()
        .matches(/^\d+$/, "PK rakamlardan oluşmalıdır")
        .min(5, "en az 5 karakter olmalıdır"),
    })
  ),
});
