import FormikControl from "../formik/FormikControl";
import { useEffect, useState, useRef } from "react";
import { useFormikContext } from "formik";
import axios from "@/utils/axios";
import LineItems from "./LineItems";

export default function FormFields() {
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { values, setFieldValue } = useFormikContext();
  const skipEffectRef = useRef(false);

  useEffect(() => {
    if (skipEffectRef.current) {
      skipEffectRef.current = false; // reset for next time
      return;
    }

    const fetchCompanies = async () => {
      if (!values.search || values.search.length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const { data } = await axios.get(
          `/api/company/find?search=${values.search}`
        );
        if (data.success) {
          setSearchResults(data.companies);
          setShowDropdown(true);
        } else {
          setSearchResults([]);
          setShowDropdown(false);
        }
      } catch (err) {
        console.error(err);
        setShowDropdown(false);
      }
    };

    const delayDebounceFn = setTimeout(fetchCompanies, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [values.search]);

  const onSelectCompany = (company) => {
    skipEffectRef.current = true;

    setFieldValue("title", company.title);
    setFieldValue("vatTitle", company.vatTitle);
    setFieldValue("companyId", company.id);
    setFieldValue("email", company.email);
    setFieldValue("domain", company.domain);
    setFieldValue("city", company.city);
    setFieldValue("line1", company.line1);
    setFieldValue("line2", company.line2);
    setFieldValue("country", company.country);
    setFieldValue("district", company.district);
    setFieldValue("search", company.title);

    setShowDropdown(false);
  };

  return (
    <>
      <FormikControl
        control="input"
        type="text"
        label="Firma Ara"
        autoComplete="off"
        name="search"
        onFocus={() => searchResults.length && setShowDropdown(true)}
      />
      {showDropdown && (
        <div className="flex flex-col my-2 border bg-purple-300 max-h-48 overflow-auto w-full text-black">
          {searchResults.map((company) => (
            <div
              key={company.id}
              onClick={() => onSelectCompany(company)}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {company.title} - {company.city} ({company.country})
            </div>
          ))}
          {searchResults.length === 0 && (
            <div className="p-2">No Search Result</div>
          )}
        </div>
      )}
      <FormikControl
        control="input"
        type="text"
        label="Firma Adı"
        name="title"
      />
      <FormikControl
        control="input"
        type="text"
        label="Tam Unvan"
        name="vatTitle"
      />
      <FormikControl control="input" type="email" label="Email" name="email" />
      <FormikControl control="input" type="text" label="Web" name="domain" />
      <div className="flex flex-col gap-1 border border-stone-300 rounded-lg py-4 px-2 my-4">
        <div className="text-white font-semibold text-lg">Adres Bilgileri</div>

        <FormikControl
          control="input"
          type="text"
          label="Mahalle Sokak"
          name="line1"
        />
        <FormikControl
          control="input"
          type="text"
          label="Bina / Kapi No"
          name="line2"
        />
        <FormikControl
          control="input"
          type="text"
          label="ilce"
          name="district"
        />
        <div className="grid grid-cols-2 gap-2">
          <FormikControl
            control="input"
            type="text"
            label="Şehir"
            name="city"
          />
          <FormikControl
            control="input"
            type="text"
            label="Ulke"
            name="country"
          />
        </div>
      </div>
      <LineItems />
      <div className="grid grid-cols-3 gap-1">
        <FormikControl
          control="input"
          type="number"
          label="KDV Oranı"
          name="vatRate"
          min={0}
          max={100}
        />
        <FormikControl
          control="checkbox"
          label="KDV Goster"
          name="showVat"
        />
        <FormikControl
          control="checkbox"
          label="Toplamlari Goster"
          name="showTotals"
        />
      </div>
    </>
  );
}
