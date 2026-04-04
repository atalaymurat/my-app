// LineItem.js
import React from "react";
import FormikControl from "../formik/FormikControl";
import { useFormikContext } from "formik";
import { formPrice } from "@/lib/helpers";

export function LineItem({ item, index, isLocked = false }) {
  // Optıon Listesinden Seçileni selectedOptions Formik Hafızasına alıyoruz
  const { values, setFieldValue } = useFormikContext();
  const recalculateLinePrice = (lineIndex, selectedOptions) => {
    const lineItem = values.lineItems[lineIndex];
    const variantPriceList = lineItem.variantPriceList || 0;
    const variantPriceOffer = lineItem.variantPriceOffer || 0;
    const variantPriceNet = lineItem.variantPriceNet || 0;

    const optionsListTotal = selectedOptions.reduce(
      (sum, opt) => sum + (opt.listPrice || 0) * (opt.quantity || 1), 0
    );
    const optionsOfferTotal = selectedOptions.reduce(
      (sum, opt) => sum + (opt.offerPrice || 0) * (opt.quantity || 1), 0
    );
    const optionsNetTotal = selectedOptions.reduce(
      (sum, opt) => sum + (opt.netPrice || 0) * (opt.quantity || 1), 0
    );

    setFieldValue(`lineItems.${lineIndex}.priceList`, variantPriceList + optionsListTotal);
    setFieldValue(`lineItems.${lineIndex}.priceOffer`, variantPriceOffer + optionsOfferTotal);
    setFieldValue(`lineItems.${lineIndex}.priceNet`, variantPriceNet + optionsNetTotal);
  };
  const handleOptionToggle = (lineIndex, option) => {
    const current = values.lineItems[lineIndex].selectedOptions || [];

    const exists = current.find((o) => o.value === option.value);

    let updated;

    if (exists) {
      updated = current.filter((o) => o.value !== option.value);
    } else {
      updated = [
        ...current,
        {
          value: option.value,
          label: option.label,
          listPrice: option.listPrice,
          offerPrice: option.offerPrice,
          netPrice: option.netPrice,
          currency: option.currency,
          desc: option.desc,
          quantity: 1,
        },
      ];
    }

    setFieldValue(`lineItems.${lineIndex}.selectedOptions`, updated);
    recalculateLinePrice(lineIndex, updated);
  };

  return (
    <div className="bg-black border border-stone-700 rounded-xl py-2 px-2">
      <input type="hidden" name={`lineItems.${index}.title`} value={item.title || ""} readOnly />

      {!isLocked && item.options?.length > 0 && (
        <div className="mt-3 rounded-xl border border-stone-700 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-2.5 border-b border-stone-700 bg-stone-900/60">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Opsiyonel Özellikler
            </p>
          </div>

          {/* Option Cards */}
          <div className="divide-y divide-stone-800">
            {item.options.map((option) => {
              const selected = item.selectedOptions?.find(
                (o) => o.value === option.value,
              );
              const isChecked = !!selected;

              return (
                <div
                  key={option.value}
                  className={`transition-colors duration-150 ${
                    isChecked ? "bg-stone-800/50" : "bg-transparent hover:bg-stone-900/40"
                  }`}
                >
                  {/* Main row */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    {/* Tıklanabilir alan: image + text */}
                    <div
                      className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleOptionToggle(index, option)}
                    >
                      {/* Görsel */}
                      <div className="shrink-0 w-[45px] h-[45px] rounded-lg bg-stone-800 border border-stone-700 overflow-hidden flex items-center justify-center mt-0.5">
                        {option.image
                          ? <img src={option.image} alt={option.label} className="w-full h-full object-cover" />
                          : <svg className="w-5 h-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        }
                      </div>

                      {/* Text: title + desc stacked */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium leading-snug truncate ${isChecked ? "text-white" : "text-stone-200"}`}>
                          {option.label}
                        </p>
                        {option.desc && (
                          <p className="text-xs text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">{option.desc}</p>
                        )}
                        <span className={`inline-flex items-center mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isChecked
                            ? "bg-emerald-900/60 text-emerald-400 border border-emerald-700/50"
                            : "bg-stone-800 text-stone-400 border border-stone-700"
                        }`}>
                          +{formPrice(option.listPrice)} {option.currency}
                        </span>
                      </div>
                    </div>

                    {/* Adet — her zaman render, sadece görünürlük değişir */}
                    <div className={`shrink-0 transition-opacity duration-150 ${isChecked ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                      <input
                        type="number"
                        min="1"
                        value={selected?.quantity ?? 1}
                        onChange={(e) => {
                          const qty = Number(e.target.value);
                          const updated = item.selectedOptions.map((o) =>
                            o.value === option.value ? { ...o, quantity: qty } : o,
                          );
                          setFieldValue(`lineItems.${index}.selectedOptions`, updated);
                          recalculateLinePrice(index, updated);
                        }}
                        className="w-14 px-2 py-1 text-sm bg-stone-900 border border-stone-600 rounded-lg text-white text-center focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Custom Checkbox */}
                    <div className="shrink-0 cursor-pointer" onClick={() => handleOptionToggle(index, option)}>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 ${
                        isChecked ? "bg-emerald-500 border-emerald-500" : "border-stone-600 bg-transparent"
                      }`}>
                        {isChecked && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}



      {/* Fiyatlandırma */}
      <div className="rounded-xl border border-stone-700 overflow-hidden mt-3">
        <div className="px-4 py-2 border-b border-stone-700 bg-stone-900/60">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Fiyatlandırma</p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-stone-700">
          {/* Liste */}
          <div className="flex flex-col gap-1 p-3 border-t-2 border-t-stone-500">
            <span className="text-xs text-stone-500 font-medium">Liste</span>
            <FormikControl control="price" name={`lineItems.${index}.priceList`} />
          </div>
          {/* Teklif */}
          <div className="flex flex-col gap-1 p-3 border-t-2 border-t-amber-500">
            <span className="text-xs text-amber-500 font-medium">Teklif</span>
            <FormikControl control="price" name={`lineItems.${index}.priceOffer`} />
          </div>
          {/* Net */}
          <div className="flex flex-col gap-1 p-3 border-t-2 border-t-emerald-500">
            <span className="text-xs text-emerald-500 font-medium">Net</span>
            <FormikControl control="price" name={`lineItems.${index}.priceNet`} />
          </div>
        </div>
        <div className="px-3 pb-3 border-t border-stone-700">
          <FormikControl control="input" label="Döviz" name={`lineItems.${index}.currency`} />
        </div>
      </div>
      <FormikControl
        control="input"
        type="number"
        label="Adet"
        name={`lineItems.${index}.quantity`}
      />

      <FormikControl
        control="textArea"
        label="Not"
        name={`lineItems.${index}.notes`}
      />

    </div>
  );
}
