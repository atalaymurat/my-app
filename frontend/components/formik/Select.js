import React from 'react'
import { Field, ErrorMessage } from 'formik'
import TextError from './TextError'

function Select(props) {
  const { label, name, options, ...rest } = props
  return (
    <div className="flex flex-col p-0 m-0">
      <label htmlFor="{name}" className="block">
        <span className="text-sm font-semibold text-gray-500">{label}</span>
      </label>
      <Field
        as="select"
        id={name}
        name={name}
        {...rest}
        className={`px-1 py-[6px] border border-gray-300 rounded`}
      >
        {options.map((op) => {
          return (
            <option value={op.value} key={op.value} className='capitalize text-xs'>
              {op.label}
            </option>
          )
        })}
      </Field>
      <ErrorMessage name={name} component={TextError} />
    </div>
  )
}

export default Select