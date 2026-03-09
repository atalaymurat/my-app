"use client";
import FormikControl from "../formik/FormikControl";
import { useFormikContext } from "formik";
import { useState, useEffect } from "react";
import axios from "@/utils/axios";

const FormFields = ({  makes }) => {
  const { values, setFieldValue } = useFormikContext();
  const [masterProducts, setMasterProducts] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(false);


  useEffect(() => {
    if (!values.make) {
      setMasterProducts([]);
      setFieldValue("masterProducts", []);
      return;
    }

    const fetchMasterProducts = async () => {
      try {
        setLoadingMasters(true);

        const { data } = await axios.get(`/api/master/masterbymake/${values.make}`);

        if (data.success) {
          const formatted = data.masters.map((opt) => ({
            value: opt._id,
            label: opt.title,
          }));

          setMasterProducts(formatted);
        }
      } catch (err) {
        console.error("Options fetch error:", err);
      } finally {
        setLoadingMasters(false);
      }
    };

    fetchMasterProducts();

    // make değişince seçili optionları temizle
    setFieldValue("options", []);
  }, [values.make]);



  return (
    <>
      <FormikControl control="input" type="text" label="Baslik" name="title" />
      <FormikControl
        control="textArea"
        type="text"
        label="Açıklamalar"
        name="description"
      />
      <FormikControl
        control="checkboxSingle"
        label="Marka"
        name="make"
        options={makes}
      />
      <FormikControl
        control="checkboxGroup"
        label="Master Ürün"
        name="masterProducts"
        options={masterProducts}
      />
      <div className="border border-blue-800 px-2 py-4 rounded-lg h-full w-full">
        <div className="text-stone-200 text-lg">Fiyat Bilgileri</div>
        <div className="flex flex-row gap-2 h-full items-end">
          <FormikControl
            control="checkboxSingle"
            label="Doviz"
            name="currency"
            options={[
              { label: "TL", value: "TRY" },
              { label: "EUR", value: "EUR" },
              { label: "USD", value: "USD" },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <FormikControl
            control="price"
            label="Liste Fiyatı"
            name="priceList"
          />
          <FormikControl
            control="price"
            label="Teklif Fiyatı"
            name="priceOffer"
          />
          <FormikControl control="price" label="Net Fiyatı" name="priceNet" />
        </div>
      </div>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      <pre>{JSON.stringify(masterProducts, null, 2)}</pre>
    </>
  );
};
export default FormFields;
