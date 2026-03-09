"use client";
import FormikControl from "../formik/FormikControl";
import { FieldArray, useFormikContext } from "formik";
import { useState, useEffect } from "react";
import axios from "@/utils/axios";

const FormFields = ({ loading, makes }) => {
  const { values, setFieldValue } = useFormikContext();
  const [options, setOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  useEffect(() => {
    if (!values.make) {
      setOptions([]);
      setFieldValue("options", []);
      return;
    }

    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);

        const { data } = await axios.get(`/api/option/make/${values.make}`);

        if (data.success) {
          const formatted = data.options.map((opt) => ({
            value: opt._id,
            label: opt.title,
          }));

          setOptions(formatted);
        }
      } catch (err) {
        console.error("Options fetch error:", err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();

    // make değişince seçili optionları temizle
    setFieldValue("options", []);
  }, [values.make]);

  return (
    <>
      {loading ? (
        <div>Loading Data Please Wait ...</div>
      ) : (
        <FormikControl
          control="checkboxSingle"
          label="Marka"
          name="make"
          options={makes}
        />
      )}
      <FormikControl
        control="input"
        type="text"
        label="Model Ailesi"
        name="model"
      />
      <FormikControl
        control="checkboxSingle"
        label="Durumu"
        name="condition"
        className="border border-purple-800 px-2 py-4 rounded-lg h-full w-full"
        options={[
          { label: "Yeni", value: "new" },
          { label: "Kullanilmis", value: "used" },
          { label: "Sifirlanmis", value: "refurbished" },
        ]}
      />
      <FormikControl
        control="input"
        type="text"
        label="Alt Başlık"
        name="caption"
      />

      {loadingOptions ? (
        <div>Loading Options Please Wait ...</div>
      ) : (
        <FormikControl
          control="checkboxGroup"
          label="Opsiyonlar"
          name="options"
          options={options}
        />
      )}
      <div>
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

      <FieldArray name="variants">
        {({ push, remove }) => {
          return (
            <>
              <div className="text-xl font-bold my-2 border border-red-800 rounded-xl p-2">
                Ürün Varyantları
                {values.variants.map((item, index) => (
                  <div key={index}>
                    <FormikControl
                      control="input"
                      type="text"
                      label="Model Tipi"
                      name={`variants.${index}.modelType`}
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      label="Model Kodu"
                      name={`variants.${index}.code`}
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      label="Stok adedi"
                      name={`variants.${index}.stock`}
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 py-4 my-2">
                      <div className="border border-green-800 px-2 py-4 rounded-lg h-full w-full">
                        <div className="text-stone-200 text-lg">
                          Liste Fiyat
                        </div>
                        <div className="flex flex-row gap-1 h-full items-center">
                          <FormikControl
                            control="price"
                            label="Fiyat"
                            name={`variants.${index}.priceList`}
                          />
                        </div>
                      </div>
                      <div className="border border-green-800 px-2 py-4 rounded-lg h-full w-full">
                        <div className="text-stone-200 text-lg">
                          Teklif Fiyat
                        </div>
                        <div className="flex flex-row gap-1 h-full items-center">
                          <FormikControl
                            control="price"
                            label="Fiyat"
                            name={`variants.${index}.priceOffer`}
                          />
                        </div>
                      </div>
                      <div className="border border-purple-800 px-2 py-4 rounded-lg h-full w-full">
                        <div className="text-stone-200 text-lg">Net Fiyat</div>
                        <div className="flex flex-row gap-1 h-full items-center">
                          <FormikControl
                            control="price"
                            label="Fiyat"
                            name={`variants.${index}.priceNet`}
                          />
                        </div>
                      </div>
                    </div>
                    {values.variants.length > 1 && (
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="btn-purple my-2 w-full"
                          onClick={() => remove(index)}
                        >
                          Sil
                        </button>
                      </div>
                    )}
                    <FieldArray name={`variants.${index}.technicalSpecs`}>
                      {({ push, remove }) => {
                        return (
                          <>
                            <div className="text-xl font-bold my-2 border border-green-900 rounded-lg px-2 py-2">
                              Teknik Veriler
                              {values.variants[index].technicalSpecs?.map(
                                (spec, idx) => (
                                  <div
                                    key={idx}
                                    className="grid grid-cols-1 lg:grid-cols-3 gap-2 "
                                  >
                                    <FormikControl
                                      control="input"
                                      type="text"
                                      label="Tanım"
                                      name={`variants.${index}.technicalSpecs.${idx}.key`}
                                    />
                                    <FormikControl
                                      control="input"
                                      type="text"
                                      label="Değer"
                                      name={`variants.${index}.technicalSpecs.${idx}.value`}
                                    />
                                    {values.variants[index].technicalSpecs
                                      .length > 1 && (
                                      <div className="flex items-center">
                                        <button
                                          type="button"
                                          className="btn-purple my-2 w-full"
                                          onClick={() => remove(idx)}
                                        >
                                          Spec Sil
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ),
                              )}
                              <div>
                                <button
                                  type="button"
                                  className="btn-submit my-1 w-full"
                                  onClick={() => push({})}
                                >
                                  Teknik Spec Ekle +++
                                </button>
                              </div>
                            </div>
                          </>
                        );
                      }}
                    </FieldArray>
                  </div>
                ))}
                <div>
                  <button
                    type="button"
                    className="btn-submit my-1 w-full"
                    onClick={() => push({})}
                  >
                    Varyant Ekle +++
                  </button>
                </div>
              </div>
            </>
          );
        }}
      </FieldArray>
      <pre>{JSON.stringify(values, null, 2)}</pre>
    </>
  );
};
export default FormFields;
