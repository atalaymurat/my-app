// Create a separate component to access Formik context
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import FormikControl from "../formik/FormikControl";
import axios from '@/utils/axios';

const WebUrlWithMeta = ({ metadata, setMetadata, setMessage }) => {
  const [contactData, setContactData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const formik = useFormikContext();

  const fetchUrlMetadata = async (url) => {
    if (!url) {
      setMessage(null);
      setMetadata(null);
      setContactData(null);
      return;
    }

    try {
      setIsFetching(true);
      const response = await axios.post("/api/scrape/meta", { url });
      setMetadata(response.data);
      // setContactData(contactRes.data);
    } catch (error) {
      console.error("Failed to fetch metadata:", error);
      setMetadata(null);
      setContactData(null);
    } finally {
      setIsFetching(false);
    }
  };

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
        label="Url to Scrape"
        name="url"
        placeholder="Kazıma İçin web adresi girin"
        onBlur={(e) => {
          // Only fetch when user leaves the field
          setMessage(null);
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

export default WebUrlWithMeta;
