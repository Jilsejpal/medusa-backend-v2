import { Input, Textarea, Checkbox } from "@medusajs/ui";
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
    default:
      return Input;
  }
};

export default getInputElement;
