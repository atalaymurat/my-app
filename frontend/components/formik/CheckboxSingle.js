import React from 'react';
import { Field, ErrorMessage } from 'formik';
import TextError from './TextError';

function SingleCheckBoxGroup(props) {
  const { name, label, options, className, ...rest } = props;
  
  return (
    <div className={`flex flex-col space-y-1 my-2 ${className}`}>
      <label className="block">
        <span className="text-sm font-semibold text-gray-500">{label}</span>
      </label>
      <div className="flex flex-row space-x-4 px-2 py-4 border bg-black text-gray-500 border-gray-300 rounded transition duration-300 focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200">
        <Field name={name} {...rest}>
          {({ field, form }) => (
            <div className="flex flex-row gap-3 w-full">
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    id={option.value}
                    checked={field.value === option.value}
                    onChange={() => {
                      form.setFieldValue(
                        name,
                        field.value === option.value ? '' : option.value
                      );
                    }}
                  />
                  <label htmlFor={option.value}>{option.label}</label>
                </div>
              ))}
            </div>
          )}
        </Field>
      </div>
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
}

export default SingleCheckBoxGroup;