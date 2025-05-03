import React from 'react'
import { Field, ErrorMessage, useField } from 'formik'
import TextError from './TextError'

function TextArea(props) {
  const [field, meta] = useField(props)
  const { label, name, ...rest} = props
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="block">
        <span className="text-sm font-semibold text-gray-500">{label}</span>
      </label>
      <Field
        as="textarea"
        rows="4"
        id={name}
        name={name}
        {...rest}
        className={`px-4 py-2 border text-gray-500 border-gray-300 rounded transition duration-300 focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200 ${
          meta.touched && meta.error ? 'border-red-600 border-2' : null
        }`}
      />
      <ErrorMessage name={name} component={TextError} />
    </div>
  )
}

export default TextArea