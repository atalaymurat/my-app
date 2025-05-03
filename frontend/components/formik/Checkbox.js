import React from "react";
import { Field, ErrorMessage } from "formik";
import TextError from "./TextError";

function Checkbox(props) {
  const { name, label, className, ...rest } = props;
  return (
    <div className={`flex flex-col p-4 items-center justify-center`}>
      <label>
        <Field id={name} name={name} type="checkbox" {...rest} />
        <span className="ml-2">{label}</span>
      </label>
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
}

export default Checkbox;