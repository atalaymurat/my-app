import React from "react";
import { Field, ErrorMessage } from "formik";
import TextError from "./TextError";
import { formPrice } from "@/lib/helpers";

function CheckBoxGroup(props) {
  const { name, label, options, className, ...rest } = props;
  return (
    <div className={`flex flex-col space-y-1 my-2 ${className}`}>
      <label className="block">
        <span className="text-sm font-semibold text-gray-500">{label}</span>
      </label>
      <div className="flex flex-row bg-black space-x-4 px-2 py-4 border text-gray-500 border-gray-300 rounded transition duration-300 focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200">
        <Field name={name} {...rest}>
          {({ field }) => (
            <div className="grid grid-cols-1 gap-1 w-full flex-wrap">
              {options.map((option) => {
                return (
                  <div
                    key={option.label}
                    className="flex flex-row space-x-2 items-center"
                  >
                    <input
                      type="checkbox"
                      id={option.value}
                      {...field}
                      value={option.value}
                      checked={field.value.includes(option.value)}
                    />
                    <label
                      htmlFor={option.value}
                      className="text-nowrap w-full py-1"
                    >
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                        <div className="col-span-2 sm:col-span-5 flex flex-col border px-1">
                          <div className="font-semibold ">{option.label}</div>
                          <div className="text-sm">{option.desc}</div>
                        </div>
                        <div className="flex flex-row space-x-1 border font-semibold text-sm items-center justify-center">
                          <div>{formPrice(option.listPrice)}</div>
                          <div>{option.currency}</div>
                        </div>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          )}
        </Field>
      </div>
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
}

export default CheckBoxGroup;
