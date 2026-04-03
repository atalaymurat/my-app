"use client";
import FormikControl from "../formik/FormikControl";
import { useFormikContext } from "formik";
import { useState, useEffect } from "react";
import axios from "@/utils/axios";

const FormFields = ({ makes }) => {
  const { values, setFieldValue } = useFormikContext();
  const [masterProducts, setMasterProducts] = useState([]);
  const [masterCurrencies, setMasterCurrencies] = useState({});

  useEffect(() => {
    if (!values.make) {
      setMasterProducts([]);
      setMasterCurrencies({});
      setFieldValue("masterProducts", []);
      setFieldValue("currency", "");
      return;
    }

    axios.get(`/api/master/masterbymake/${values.make}`).then(({ data }) => {
      if (data.success) {
        const formatted = data.masters.map((m) => ({ value: m._id, label: m.title }));
        const currencies = {};
        data.masters.forEach((m) => { currencies[m._id] = m.currency; });
        setMasterProducts(formatted);
        setMasterCurrencies(currencies);
      }
    });

    setFieldValue("options", []);
  }, [values.make]);

  // masterProducts seçimi değişince currency otomatik set et
  useEffect(() => {
    if (values.masterProducts?.length > 0) {
      const firstId = values.masterProducts[0];
      const currency = masterCurrencies[firstId];
      if (currency) setFieldValue("currency", currency);
    }
  }, [values.masterProducts, masterCurrencies]);



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
        <div className="flex items-center gap-2 mb-2">
          <span className="text-stone-400 text-sm">Döviz:</span>
          {values.currency
            ? <span className="text-white font-semibold">{values.currency}</span>
            : <span className="text-stone-500 text-sm">Master ürün seçince otomatik gelir</span>
          }
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
    </>
  );
};
export default FormFields;
