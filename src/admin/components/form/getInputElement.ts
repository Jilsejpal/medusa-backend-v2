import { Input, Textarea, Checkbox, CurrencyInput } from "@medusajs/ui";
import FileUploadField from "./FileUploadField";
import AddDenomination from "./AddDenomination";

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
    case "add-denomination":
      return AddDenomination;
    default:
      return Input;
  }
};

export default getInputElement;
