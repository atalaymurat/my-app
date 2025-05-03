import React from "react";
import Input from "./Input";
import Checkbox from "./Checkbox";
import Select from "./Select"
import TextArea from "./TextArea";
import MaskInput from "./MaskInput";

function FormikControl(props) {
  const { control, inputRef,  ...rest } = props;

  switch (control) {
    case "input":
      return <Input inputRef={inputRef} {...rest} />;
    case "mask":
      return <MaskInput {...rest} />;
    case "checkbox":
      return <Checkbox {...rest} />;
    case "select":
      return <Select {...rest} />;
    case 'textArea':
      return <TextArea {...rest} />
    default:
      console.error(`Unsupported control type: ${control}`);
      return null;
  }
}

export default FormikControl;