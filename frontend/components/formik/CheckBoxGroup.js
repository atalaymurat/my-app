import React from 'react'
import { Field, ErrorMessage } from 'formik'
import TextError from './TextError'

function CheckBoxGroup(props) {
  const { name, label, options, className, ...rest } = props
  return (
    <div className={`flex flex-col space-y-1 my-2 ${className}`}>
      <label className="block">
        <span className="text-sm font-semibold text-gray-500">{label}</span>
      </label>
      <div className="flex flex-row bg-black space-x-4 px-2 py-4 border text-gray-500 border-gray-300 rounded transition duration-300 focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200">
        <Field name={name} {...rest}>
          {({ field }) => (
            <div className="flex flex-row gap-3 w-full">
              {options.map((option) => {
                return (
                  <div
                    key={option.label}
                    className="flex items-center space-x-1"
                  >
                    <input
                      type="checkbox"
                      id={option.value}
                      {...field}
                      value={option.value}
                      checked={field.value.includes(option.value)}
                    />
                    <label htmlFor={option.value}>{option.label}</label>
                  </div>
                )
              })}
            </div>
          )}
        </Field>
      </div>
      <ErrorMessage name={name} component={TextError} />
    </div>
  )
}

export default CheckBoxGroup