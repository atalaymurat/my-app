import React from "react";
import { Field, ErrorMessage } from "formik";
import TextError from "./TextError";

function SingleCheckBoxGroup({ name, label, options, className, ...rest }) {
  return (
    <div className={`flex flex-col space-y-1 my-2 ${className}`}>
      <label className="block">
        <span className="text-sm font-semibold text-gray-500">{label}</span>
      </label>
      <div className="flex flex-row space-x-4 px-2 py-4 bg-black text-gray-500">
        <Field name={name} {...rest}>
          {({ field, form }) => (
            <div className="grid sm:grid-cols-3 gap-3 w-full">
              {options.map((option, idx) => {
                const inputId = `${name}_${idx}`;
                return (
                  <div key={inputId} className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      id={inputId}
                      checked={field.value === option.value}
                      onChange={() =>
                        form.setFieldValue(
                          name,
                          field.value === option.value ? "" : option.value
                        )
                      }
                    />
                    <label htmlFor={inputId}>{option.label}</label>
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

export default SingleCheckBoxGroup;
