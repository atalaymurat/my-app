"use client";
import { useAuth } from "../../../context/AuthContext";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Formik, Form, FieldArray, useFormikContext } from "formik";
import * as Yup from "yup";
import FormikControl from "../../../components/formik/FormikControl";
import axios from "axios";

// Türkçe toLowerCase
const toLowerCaseTR = (str) =>
  str.replace(/I/g, "ı").replace(/İ/g, "i").toLowerCase();

// Türkçe toUpperCase
const toUpperCaseTR = (str) =>
  str.replace(/i/g, "İ").replace(/ı/g, "I").toUpperCase();

// Türkçe capitalize (her kelimenin ilk harfi büyük)
const capitalizeTR = (str) =>
  toLowerCaseTR(str).replace(/\b\w/g, (char) => toUpperCaseTR(char));

// Create a separate component to access Formik context
const WebUrlWithMetadata = ({
  isFetching,
  metadata,
  fetchUrlMetadata,
  setMetadata,
  contactData,
  setMessage
}) => {
  const formik = useFormikContext();

  useEffect(() => {
    if (metadata) {
      const updates = {};

      // Only update title if it's currently empty
      updates.title = metadata.title;
      updates.favicon = metadata.favicon;
      updates.description = metadata.description;
      updates.ogImage = metadata.ogImage;
      updates.addresses = contactData.address;
      updates.phone = contactData.phone;
      updates.email = contactData.email;

      if (Object.keys(updates).length > 0) {
        formik.setValues({
          ...formik.values,
          ...updates,
        });
      }
    }
  }, [metadata]); // Run only when metadata changes

  return (
    <>
      <FormikControl
        control="input"
        type="text"
        label="Web Url"
        name="web"
        placeholder="domain.com"
        onBlur={(e) => {
          // Only fetch when user leaves the field
          setMessage(null)
          const url = e.target.value.trim();
          if (url) {
            // Add https:// if missing
            const formattedUrl = url.startsWith("http")
              ? url
              : `https://${url}`;
            fetchUrlMetadata(formattedUrl);
          } else {
            setMetadata(null);
          }
        }}
      />

      {isFetching && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <p>Fetching website information...</p>
        </div>
      )}

      {metadata && !isFetching && (
        <div className="p-4 my-4 bg-gray-100 rounded-lg border border-gray-300">
          <h3 className="font-bold mb-2">Website Information</h3>
          {metadata.ogImage && (
            <img
              src={metadata.ogImage}
              alt="Website thumbnail"
              className="w-32 h-32 object-contain mb-2"
            />
          )}
          <p className="font-semibold">{metadata.title || "No title found"}</p>
          <p className="text-sm text-gray-600">
            {metadata.description || "No description found"}
          </p>
          {metadata.favicon && (
            <img
              src={metadata.favicon}
              alt="Favicon"
              className="w-6 h-6 mt-2"
            />
          )}
          <pre className="overflow-hidden text-xs">
            {JSON.stringify(contactData, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
};

export default function NewCompany() {
  const { user, loading, checkSession, authChecked } = useAuth();
  const router = useRouter();
  const [metadata, setMetadata] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [message, setMessage] = useState(null);

  const apiClient = axios.create({
    baseURL:
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BACKEND_URL // Make sure this env var is set in production
        : "http://localhost:5000", // Your backend URL for development
    withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
    headers: {
      "Content-Type": "application/json",
    },
  });

  const fetchUrlMetadata = async (url) => {
    if (!url) {
      setMessage(null)
      setMetadata(null);
      setContactData(null)
      return;
    }

    try {
      setIsFetching(true);
      const response = await apiClient.post("/api/scrape/meta", { url });
      const contactRes = await apiClient.post("/api/scrape/contacts", { url });
      setMetadata(response.data);
      setContactData(contactRes.data);
    } catch (error) {
      console.error("Failed to fetch metadata:", error);
      setMetadata(null);
      setContactData(null);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const verifySession = async () => {
      if (!authChecked) {
        const sessionUser = await checkSession();
        if (!sessionUser) {
          router.push("/auth");
        }
      }
    };
    verifySession();
  }, [authChecked, checkSession, router]);

  if (loading) {
    return <div className="p-8">Loading authentication status...</div>;
  }
  if (!user) {
    router.push("/auth");
    return null;
  }

  const validationSchema = Yup.object({
    title: Yup.string().required("Gerekli").min(3, "Minimum 3 characters"),
    email: Yup.string().email("Geçersiz email"),
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

  return (
    <div className="p-8 flex flex-col gap-4">
      <div className="font-bold text-2xl">
        Firma veya Şahıs Şirket Kaydı Oluştur...
      </div>
      <Formik
        enableReinitialize
        initialValues={{
          title: "",
          vatTitle: "",
          phone: "",
          email: "",
          vd: "",
          vatNo: "",
          tcNo: "",
          web: "",
          favicon: "",
          ogImage: "",
          description: "",
          addresses: [
            {
              title: "",
              line1: "",
              line2: "",
              district: "",
              city: "",
              country: "Tr",
              zip: "",
              raw: "",
            },
          ],
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);

          const processedValues = { ...values };

          // Diğer tüm alanları Türkçe küçük harfe çevir
          Object.keys(processedValues).forEach((key) => {
            if (typeof processedValues[key] === "string") {
              processedValues[key] = toLowerCaseTR(processedValues[key]);
            }
          });

          // Adresleri özel olarak capitalize et
          if (Array.isArray(processedValues.addresses)) {
            processedValues.addresses = processedValues.addresses.map(
              (addr) => {
                const capitalizedAddr = {};
                for (const [key, value] of Object.entries(addr)) {
                  if (typeof value === "string") {
                    capitalizedAddr[key] = capitalizeTR(value);
                  } else {
                    capitalizedAddr[key] = value;
                  }
                }
                return capitalizedAddr;
              }
            );
          }

          const { data } = await apiClient.post(
            "/api/company",
            processedValues
          );
          console.log("DATA SAVED COMPANY: ", JSON.stringify(data, null, 2));
          if (data.message === "success") {
            router.push("/company")
          }
          if (data.message !== "success") {
            setMessage(data.message);
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form autoComplete="off">
            <WebUrlWithMetadata
              isFetching={isFetching}
              metadata={metadata}
              fetchUrlMetadata={fetchUrlMetadata}
              setMetadata={setMetadata}
              contactData={contactData}
              setMessage={setMessage}
            />
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
              control="mask"
              type="text"
              label="Telefon"
              name="phone"
              mask="+__ (___) ___ __ __"
              replacement={{ _: /\d/ }} // Only numbers allowed
              placeholder="+90 (5__) ___ __ __"
            />
            <FormikControl
              control="input"
              type="text"
              label="Email"
              name="email"
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
            <FieldArray name="addresses">
              {({ push, remove, form }) => {
                const { values } = form;
                const { addresses } = values;
                return (
                  <div className="my-2 border border-blue-800 px-2 py-4 rounded-xl">
                    <div className="text-xl font-bold text-blue-800">
                      Adres Bilgileri
                    </div>
                    {addresses?.map((address, index) => (
                      <div
                        key={index}
                        className="bg-blue-100 my-3 border border-blue-700 rounded-xl p-4"
                      >
                        <FormikControl
                          control="input"
                          type="text"
                          label="Addres Başlık"
                          name={`addresses.${index}.title`}
                          placeholder="Fabrika, Merkez, Showroom, vs..."
                        />
                        <FormikControl
                          control="input"
                          type="text"
                          label="Ülke"
                          name={`addresses.${index}.country`}
                        />
                        <FormikControl
                          control="input"
                          type="text"
                          label="Şehir"
                          name={`addresses.${index}.city`}
                        />
                        <FormikControl
                          control="input"
                          type="text"
                          label="İlçe"
                          name={`addresses.${index}.district`}
                        />
                        <FormikControl
                          control="input"
                          type="text"
                          label="Mahalle Sokak"
                          name={`addresses.${index}.line1`}
                        />
                        <FormikControl
                          control="input"
                          type="text"
                          label="Bina No / Kat"
                          name={`addresses.${index}.line2`}
                        />
                        <FormikControl
                          control="input"
                          type="text"
                          label="Posta Kodu"
                          name={`addresses.${index}.zip`}
                        />
                        <FormikControl
                          control="input"
                          type="text"
                          label="Raw Address"
                          name={`addresses.${index}.raw`}
                        />
                        <button
                          type="button"
                          className="btn-purple my-2 w-full"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn-submit my-1 w-full"
                      onClick={() =>
                        push({
                          title: "",
                          line1: "",
                          line2: "",
                          district: "",
                          city: "",
                          country: "",
                          zip: "",
                        })
                      }
                    >
                      Add Address
                    </button>
                  </div>
                );
              }}
            </FieldArray>

            {message && (
              <div
                className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
                role="alert"
              >
                <p className="font-bold">Uyarı !</p>
                <p>{message}</p>
              </div>
            )}

            <button
              type="submit"
              className={`btn-submit mt-4 mb-8 w-full ${
                isSubmitting && "bg-red-500 text-white"
              } `}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Kaydediyor..." : "Kaydet"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
