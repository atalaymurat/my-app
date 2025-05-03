import React, { forwardRef } from 'react';
import { useField } from 'formik';
import { InputMask } from '@react-input/mask';

const MaskInput = forwardRef(({
  label,
  mask,
  replacement = { _: /\d/ },
  separate = false,
  showMask = true,
  className = '',
  inputClassName = '',
  errorClassName = '',
  disabled = false,
  placeholder,
  ...props
}, ref) => {
  const [field, meta] = useField(props);
  
  const inputClasses = `
    ${inputClassName}
    ${meta.touched && meta.error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}
    block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
  `;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={props.id || props.name} className={`block text-sm font-medium mb-1 ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
      
      <InputMask
        {...field}
        {...props}
        ref={ref}  // Proper ref forwarding
        mask={mask}
        replacement={replacement}
        separate={separate}
        showMask={showMask}
        disabled={disabled}
        placeholder={placeholder}
        className={inputClasses}
      />

      {meta.touched && meta.error && (
        <div className={`mt-1 text-sm text-red-600 ${errorClassName}`}>
          {meta.error}
        </div>
      )}
    </div>
  );
});

MaskInput.displayName = 'MaskInput'; // Helps with debugging

export default MaskInput;