"use client";
import { ErrorMessage, Field, FieldArray, Form, Formik, useField } from "formik";
import * as Yup from "yup";
import axios from "@/utils/axios";
import { useEffect, useMemo, useState } from "react";
import { InputMask } from "@react-input/mask";
import MessageBlock from "../messageBlock";

const MAX_CONTACT_VALUES = 3;
const MAX_LABEL_VALUES = 10;

const validationSchema = Yup.object({
  givenName: Yup.string().test(
    "name-parts",
    "İsim parçalarından en az biri gerekli",
    function validateNameParts() {
      const { givenName, middleName, familyName } = this.parent;
      return Boolean(givenName?.trim() || middleName?.trim() || familyName?.trim());
    },
  ),
  gender: Yup.string().oneOf(["male", "female", "none"]).required("Gerekli"),
  phones: Yup.array()
    .of(Yup.string())
    .max(MAX_CONTACT_VALUES, "En fazla 3 telefon numarası ekleyebilirsiniz"),
  emails: Yup.array()
    .of(
      Yup.string().test("optional-email", "Geçersiz email", (value) => {
        if (!value?.trim()) return true;
        return Yup.string().email().isValidSync(value.trim());
      }),
    )
    .max(MAX_CONTACT_VALUES, "En fazla 3 email adresi ekleyebilirsiniz"),
  googleLabels: Yup.array().of(Yup.string()),
});

const EMPTY_VALUES = {
  displayName: "",
  givenName: "",
  middleName: "",
  familyName: "",
  gender: "none",
  emails: [""],
  phones: [""],
  googleLabels: [],
};

function ensureEditableArray(values = []) {
  const clean = Array.isArray(values)
    ? values.map((value) => String(value || "")).filter(Boolean)
    : [];
  return clean.length ? clean : [""];
}

function ensureOptionalArray(values = []) {
  return Array.isArray(values)
    ? values.map((value) => String(value || "")).filter(Boolean)
    : [];
}

function cleanStringArray(values = []) {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

function normalizePhoneValue(phone = "") {
  const value = String(phone || "").trim();
  if (!value) return "";
  if (value.includes(":")) {
    const [countryCode, localNumber] = value.split(":");
    return `${countryCode || ""}${localNumber || ""}`.replace(/\D/g, "");
  }
  return value;
}

function toInitialValues(contact, editMode) {
  if (!editMode) return EMPTY_VALUES;

  return {
    displayName: contact.displayName || "",
    givenName: contact.givenName || "",
    middleName: contact.middleName || "",
    familyName: contact.familyName || "",
    gender: contact.gender || "none",
    emails: ensureEditableArray(contact.emails),
    phones: ensureEditableArray(contact.phones),
    googleLabels: ensureOptionalArray(contact.googleLabels),
  };
}

function buildPayload(values) {
  return {
    givenName: values.givenName?.trim() || "",
    middleName: values.middleName?.trim() || "",
    familyName: values.familyName?.trim() || "",
    gender: values.gender || "none",
    phones: cleanStringArray(values.phones).map(normalizePhoneValue).filter(Boolean),
    emails: cleanStringArray(values.emails).map((email) => email.toLowerCase()),
    googleLabels: cleanStringArray(values.googleLabels),
  };
}

const ContactForm = ({ contact }) => {
  const editMode = Boolean(contact?._id);
  const [message, setMessage] = useState(null);
  const initialValues = useMemo(() => toInitialValues(contact, editMode), [contact, editMode]);

  useEffect(() => {
    setMessage(null);
  }, [contact?._id]);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setFieldValue, setSubmitting, resetForm }) => {
          setMessage(null);
          setSubmitting(true);

          try {
            const payload = buildPayload(values);

            if (editMode) {
              const response = await axios.patch(`/api/contact/${contact._id}`, payload);
              if (response.data?.success !== false) {
                const updatedDisplayName = response.data?.record?.displayName || response.data?.contact?.displayName;
                if (updatedDisplayName) {
                  setFieldValue("displayName", updatedDisplayName, false);
                }
                setMessage({ text: "Kişi güncellendi.", type: "success" });
              }
            } else {
              const response = await axios.post("/api/contact", payload);
              if (response.data.success) {
                setMessage({
                  text: response.data.message || "Kişi kaydedildi.",
                  type: "success",
                });
                resetForm();
              } else {
                setMessage({ text: response.data.message || "Bir hata oluştu.", type: "error" });
              }
            }
          } catch (error) {
            setMessage({
              text: error.response?.data?.message || "Bir hata oluştu.",
              type: "error",
            });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form autoComplete="off" className="space-y-4">
            <Section title="Kimlik">
              <div className="grid grid-cols-1 gap-3">
                <ReadOnly label="Görünen İsim" value={values.displayName || "-"} />
                <TextField name="givenName" label="Ad" placeholder="Ad" />
                <TextField name="middleName" label="İkinci Ad" placeholder="İkinci ad" />
                <TextField name="familyName" label="Soyad" placeholder="Soyad" />
                <SelectField name="gender" label="Cinsiyet">
                  <option value="none">Belirtilmemiş</option>
                  <option value="male">Erkek</option>
                  <option value="female">Kadın</option>
                </SelectField>
              </div>
            </Section>

            <ArraySection
              title="Telefonlar"
              name="phones"
              label="Telefon"
              addLabel="Telefon Ekle"
              placeholder="+90 555 000 00 00"
              values={values.phones}
              inputComponent={PhoneInput}
            />

            <ArraySection
              title="E-postalar"
              name="emails"
              label="E-posta"
              addLabel="E-posta Ekle"
              placeholder="name@example.com"
              values={values.emails}
            />

            {editMode && (contact.sourceType === "google_csv" || values.googleLabels.length > 0) && (
              <ArraySection
                title="Google Etiketleri"
                name="googleLabels"
                label="Etiket"
                addLabel="Etiket Ekle"
                placeholder="myContacts"
                values={values.googleLabels}
                maxItems={MAX_LABEL_VALUES}
                minRows={0}
              />
            )}

            {editMode && (
              <ImportMetadata contact={contact} labels={values.googleLabels} />
            )}

            <MessageBlock message={message} />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg border border-amber-700 bg-amber-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

function Section({ title, children }) {
  return (
    <section className="rounded-lg border border-stone-700 bg-stone-900/70 p-3 sm:p-4">
      <h2 className="mb-3 text-sm font-bold text-stone-100">{title}</h2>
      {children}
    </section>
  );
}

function TextField({ label, name, placeholder }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-xs font-semibold text-stone-400">
        {label}
      </label>
      <Field
        id={name}
        name={name}
        placeholder={placeholder}
        className="w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-200 outline-none transition-colors placeholder:text-stone-600 focus:border-amber-600"
      />
      <ErrorMessage name={name} component="p" className="mt-1 text-xs text-red-400" />
    </div>
  );
}

function SelectField({ label, name, children }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-xs font-semibold text-stone-400">
        {label}
      </label>
      <Field
        as="select"
        id={name}
        name={name}
        className="w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-200 outline-none transition-colors focus:border-amber-600"
      >
        {children}
      </Field>
      <ErrorMessage name={name} component="p" className="mt-1 text-xs text-red-400" />
    </div>
  );
}

function ArraySection({
  title,
  name,
  label,
  addLabel,
  placeholder,
  values,
  maxItems = MAX_CONTACT_VALUES,
  minRows = 1,
  inputComponent: InputComponent,
}) {
  return (
    <Section title={title}>
      <FieldArray name={name}>
        {({ push, remove }) => (
          <div className="space-y-3">
            {values.map((_, index) => (
              <div key={index} className="grid grid-cols-[1fr_auto] gap-2">
                <div>
                  <label
                    htmlFor={`${name}.${index}`}
                    className="mb-1 block text-xs font-semibold text-stone-400"
                  >
                    {label} {index + 1}
                  </label>
                  {InputComponent ? (
                    <InputComponent name={`${name}.${index}`} />
                  ) : (
                    <Field
                      id={`${name}.${index}`}
                      name={`${name}.${index}`}
                      placeholder={placeholder}
                      className="w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-200 outline-none transition-colors placeholder:text-stone-600 focus:border-amber-600"
                    />
                  )}
                  <ErrorMessage
                    name={`${name}.${index}`}
                    component="p"
                    className="mt-1 text-xs text-red-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={values.length <= minRows}
                  className="mt-6 h-10 w-10 rounded-lg border border-stone-700 text-stone-400 transition-colors hover:border-red-700 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`${label} sil`}
                >
                  ×
                </button>
              </div>
            ))}
            {values.length < maxItems && (
              <button
                type="button"
                onClick={() => push(name === "phones" ? "90:" : "")}
                className="w-full rounded-lg border border-stone-700 px-3 py-2 text-sm font-semibold text-stone-300 transition-colors hover:bg-stone-800"
              >
                {addLabel}
              </button>
            )}
          </div>
        )}
      </FieldArray>
    </Section>
  );
}

function PhoneInput({ name }) {
  const [field, , helpers] = useField(name);

  const parse = (value) => {
    if (!value) return { countryCode: "90", localNumber: "" };
    if (String(value).includes(":")) {
      const [countryCode, localNumber] = String(value).split(":");
      return { countryCode: countryCode || "90", localNumber: localNumber || "" };
    }

    const digits = String(value).replace(/\D/g, "");
    return { countryCode: digits.slice(0, 2) || "90", localNumber: digits.slice(2) };
  };

  const toMasked = (value) => {
    const digits = String(value || "").replace(/\D/g, "").slice(0, 10);
    let masked = "";
    for (let index = 0; index < digits.length; index += 1) {
      if (index === 3 || index === 6 || index === 8) masked += " ";
      masked += digits[index];
    }
    return masked;
  };

  const { countryCode, localNumber } = parse(field.value);
  const maskedLocalNumber = toMasked(localNumber);

  const updateValue = (nextCountryCode, nextLocalNumber) => {
    helpers.setValue(`${nextCountryCode}:${String(nextLocalNumber || "").replace(/\D/g, "")}`);
  };

  return (
    <div className="flex gap-2">
      <div className="flex items-center">
        <span className="rounded-l-lg border border-r-0 border-stone-700 bg-stone-950 px-2 py-2.5 text-sm text-stone-500">
          +
        </span>
        <input
          type="text"
          value={countryCode}
          autoComplete="off"
          onChange={(event) => {
            const nextCountryCode = event.target.value.replace(/\D/g, "").slice(0, 3);
            updateValue(nextCountryCode, localNumber);
          }}
          className="w-12 rounded-r-lg border border-stone-700 bg-stone-950 px-2 py-2.5 text-sm text-stone-200 outline-none transition-colors focus:border-amber-600"
        />
      </div>
      <InputMask
        mask="___ ___ __ __"
        replacement={{ _: /\d/ }}
        placeholder="___ ___ __ __"
        value={maskedLocalNumber}
        autoComplete="off"
        onChange={(event) => updateValue(countryCode, event.target.value)}
        className="min-w-0 flex-1 rounded-lg border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-200 outline-none transition-colors placeholder:text-stone-600 focus:border-amber-600"
      />
    </div>
  );
}

function ImportMetadata({ contact, labels }) {
  const hasImportData =
    contact.sourceType === "google_csv" ||
    contact.source === "google" ||
    contact.importedAt ||
    contact.sourceRowHash ||
    labels?.length;

  if (!hasImportData) return null;

  return (
    <Section title="Import Bilgisi">
      <div className="grid grid-cols-1 gap-3">
        <ReadOnly label="Kaynak" value={contact.source || "manual"} />
        <ReadOnly label="Kaynak Tipi" value={contact.sourceType || "manual"} />
        <ReadOnly
          label="Import Tarihi"
          value={contact.importedAt ? new Date(contact.importedAt).toLocaleString("tr-TR") : "-"}
        />
        <ReadOnly label="Satır Hash" value={contact.sourceRowHash || "-"} />
        <div>
          <p className="mb-1 text-xs font-semibold text-stone-400">Google Etiketleri</p>
          {labels?.length ? (
            <div className="flex flex-wrap gap-2">
              {labels.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-stone-700 bg-stone-950 px-2.5 py-1 text-xs text-stone-300"
                >
                  {label}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-500">-</p>
          )}
        </div>
      </div>
    </Section>
  );
}

function ReadOnly({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold text-stone-400">{label}</p>
      <p className="break-all rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-sm text-stone-300">
        {value}
      </p>
    </div>
  );
}

export default ContactForm;
