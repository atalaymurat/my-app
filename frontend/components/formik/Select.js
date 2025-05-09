import React from 'react'
import { FastField, ErrorMessage } from 'formik'
import TextError from './TextError'

function Select(props) {
  const { label, name, options, ...rest } = props

  return (
    <FastField name={name}>
      {({ field, meta }) => (
        <div className="flex flex-col p-0 m-0">
          {label && (
            <label htmlFor={name} className="block">
              <span className="text-sm font-semibold text-gray-500">{label}</span>
            </label>
          )}
          <select
            id={name}
            {...field}
            {...rest}
            className={`px-1 py-[9px] border border-gray-300 rounded font-bold ${
              meta.touched && meta.error ? "border-red-600 border-2" : ""
            }`}
          >
            {options.map((op) => (
              <option value={op.value} key={op.value} className="capitalize text-xs">
                {op.label}
              </option>
            ))}
          </select>
          <ErrorMessage name={name} component={TextError} />
        </div>
      )}
    </FastField>
  )
}

export default Select