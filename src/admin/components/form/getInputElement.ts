import { Input, Textarea, Checkbox, CurrencyInput } from "@medusajs/ui";
import FileUploadField from "./FileUploadField";

type InputElementType = React.ComponentType<any>;

const getInputElement = (type: string): InputElementType => {
  switch (type) {
    case "input":
      return Input;
    case "textarea":
      return Textarea;
    case "checkbox":
      return Checkbox;
    case "file-upload":
      return FileUploadField;
    case "currency-input":
      return CurrencyInput;
    default:
      return Input;
  }
};

export default getInputElement;
