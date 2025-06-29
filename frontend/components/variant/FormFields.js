"use client";
import FormikControl from "../formik/FormikControl";
import { useFormikContext } from "formik";
import { useEffect, useState, useMemo } from "react";
import axios from "@/utils/axios";
import { formPrice } from "@/lib/helpers";

const FormFields = ({ makeList }) => {
  const { values, setFieldValue } = useFormikContext();
  const [optionList, setOptionList] = useState([]);
  const [masterProducts, setMasterProducts] = useState(null);

  useEffect(() => {
    const fetchOptionList = async (masterProductId) => {
      if (!masterProductId || masterProductId === "") return;
      try {
        const { data } = await axios.get(`/api/option/list/${masterProductId}`);
        if (data.success) {
          setFieldValue("options", []); // Reset options when base product changes
          setOptionList(data.list);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptionList(values.masterProduct);
  }, [values.masterProduct]);

  useEffect(() => {
    if (!values.make) return;
    const fetchMasterProducts = async (make) => {
      try {
        const { data } = await axios.get(`/api/master/list?make=${make}`);
        if (data.success) {
          // Only reset fields if previously set
          setFieldValue("masterProduct", "");
          setFieldValue("title", "");
          setFieldValue("options", []);
          setOptionList([]);
          setMasterProducts(data.list);
        }
      } catch (error) {
        console.error("Error fetching master products by make :", error);
      }
    };
    fetchMasterProducts(values.make);
  }, [values.make]);

  // 🆕 MasterProduct seçildiğinde alanlari doldur
  useEffect(() => {
    if (!values.masterProduct) return;

    const selected = masterProducts?.find(
      (item) => item.value === values.masterProduct
    );
    console.log("Selected Master Product:", JSON.stringify(selected, null, 2));
    setFieldValue("title", `${selected.make} ${selected.model} ${selected.year}`);
    setFieldValue("condition", selected.condition);
    setFieldValue("year", selected.year);
    setFieldValue("model", selected.model);
    setFieldValue("description", selected.desc);
    setFieldValue("productVariant", selected.productVariant);
    setFieldValue(`quantity`, 1); // Reset quantity to 1 when master product changes
  }, [values.masterProduct, masterProducts, setFieldValue]);

  // Total List Price Calculation
  const totalListPrice = useMemo(() => {
    let total = 0;
    let currency = ""; // fallback

    const selectedMasterProduct = masterProducts?.find(
      (item) => item.value === values.masterProduct
    );

    if (selectedMasterProduct) {
      total += selectedMasterProduct.listPrice || 0;
      currency = selectedMasterProduct.currency || currency;
    }

    const selectedOptions = optionList.filter((option) =>
      values.options?.includes(option.value)
    );

    selectedOptions.forEach((option) => {
      total += option.listPrice || 0;
    });

    return { value: total, currency };
  }, [values.masterProduct, values.options, masterProducts, optionList]);

  useEffect(() => {
    setFieldValue("priceList", totalListPrice);
  }, [totalListPrice]);

  return (
    <>
      <FormikControl control="input" type="text" label="Baslik" name="title" />
      <FormikControl
        control="checkboxSingle"
        label="Marka"
        name="make"
        options={makeList}
      />
      <FormikControl
        control="checkboxProducts"
        label="Temel Urun"
        name="masterProduct"
        options={masterProducts || []}
      />
      {optionList.length > 0 && (
        <FormikControl
          control="checkboxOptions"
          label="Ilave Opsiyonlar"
          name="options"
          options={optionList}
        />
      )}
      <FormikControl control="input" type="hidden" name="priceList" />
      <FormikControl control="input" type="hidden" name="condition" />
      <FormikControl control="input" type="hidden" name="model" />
      <FormikControl control="input" type="hidden" name="year" />
      <FormikControl control="input" type="hidden" name="description" />
      {totalListPrice.value > 0 && (
        <div className="flex flex-row space-x-2 my-2 border border-gray-400 px-2 py-2 w-full">
          <div className="text-gray-500 font-semibold">Toplam Liste Fiyati</div>
          <div className="text-white ml-auto">
            {formPrice(values.priceList.value)}
          </div>
          <div className="text-white">{values.priceList.currency}</div>
        </div>
      )}
    </>
  );
};
export default FormFields;
