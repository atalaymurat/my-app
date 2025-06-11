"use client";
import FormikControl from "../formik/FormikControl";
import { useFormikContext } from "formik";
import { useEffect, useState, useMemo } from "react";
import axios from "@/utils/axios";
import { formPrice } from "@/lib/helpers";

const FormFields = ({ makeList }) => {
  const { values, setFieldValue } = useFormikContext();
  const [optionList, setOptionList] = useState([]);
  const [baseProducts, setBaseProducts] = useState(null);

  useEffect(() => {
    const fetchOptionList = async (baseProductId) => {
      if (!baseProductId || baseProductId === "") return;
      try {
        const { data } = await axios.get(`/api/option/list/${baseProductId}`);
        if (data.success) {
          setFieldValue("options", []); // Reset options when base product changes
          setOptionList(data.list);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptionList(values.baseProduct);
  }, [values.baseProduct]);

  useEffect(() => {
    if (!values.make) return;
    const fetchBaseProducts = async (make) => {
      try {
        const { data } = await axios.get(`/api/base-product/list?make=${make}`);
        if (data.success) {
          // Only reset fields if previously set
          setFieldValue("baseProduct", "");
          setFieldValue("options", []);
          setOptionList([]);
          setBaseProducts(data.list);
        }
      } catch (error) {
        console.error("Error fetching base products by make :", error);
      }
    };
    fetchBaseProducts(values.make);
  }, [values.make]);

  // Total List Price Calculation
  const totalListPrice = useMemo(() => {
    let total = 0;
    let currency = ""; // fallback

    const selectedBaseProduct = baseProducts?.find(
      (item) => item.value === values.baseProduct
    );

    if (selectedBaseProduct) {
      total += selectedBaseProduct.listPrice || 0;
      currency = selectedBaseProduct.currency || currency;
    }

    const selectedOptions = optionList.filter((option) =>
      values.options?.includes(option.value)
    );

    selectedOptions.forEach((option) => {
      total += option.listPrice || 0;
    });

    return { value: total, currency };
  }, [values.baseProduct, values.options, baseProducts, optionList]);

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
        name="baseProduct"
        options={baseProducts || []}
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
