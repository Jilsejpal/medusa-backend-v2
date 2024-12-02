import clsx from "clsx";
import React, { useRef, useState, useEffect } from "react";
import { XMark, Trash } from "@medusajs/icons";

type FileUploadFieldProps = {
  onChange: (files: File[]) => void;
  value: File[] | string;
  filetypes: string[];
  errorMessage?: string;
  placeholder?: React.ReactElement | string;
  className?: string;
  multiple?: boolean;
  text?: React.ReactElement | string;
  preview?: boolean;
};

const defaultText = (
  <span>
    Drop your images here, or{" "}
    <span className="text-violet-60">click to browse</span>
  </span>
);

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  onChange,
  value,
  filetypes,
  errorMessage,
  className,
  text = defaultText,
  placeholder = "",
  multiple = false,
  preview = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // console.log({ value, selectedImage });

  useEffect(() => {
    if (value && typeof value !== "string" && value.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(value[0]);
    } else {
      setSelectedImage(null);
      setFileUploadError(false);
    }
  }, [value, selectedImage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    if (fileList) {
      const filesArray = Array.from(fileList);
      onChange(filesArray);

      if (filesArray.length > 0) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(filesArray[0]);
      }
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setFileUploadError(false);
    e.preventDefault();

    const files: File[] = [];

    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === "file") {
          const file = e.dataTransfer.items[i].getAsFile();
          if (file && filetypes.indexOf(file.type) > -1) {
            files.push(file);
          }
        }
      }
    } else {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        if (filetypes.indexOf(e.dataTransfer.files[i].type) > -1) {
          files.push(e.dataTransfer.files[i]);
        }
      }
    }

    if (files.length > 0) {
      onChange(files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFileUploadError(true);
    }
  };

  return (
    <div className="flex items-center gap-8 h-[200px]">
      {preview && (
        <>
          {value && typeof value === "string" ? (
            <div className="relative h-full aspect-[3/4] flex items-center justify-center border-ui-border-strong rounded-lg border border-dashed p-2">
              <img
                src={value}
                alt="Selected"
                className="w-auto max-w-48 h-full object-container rounded"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                  onChange([]);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 focus:outline-none"
              >
                <Trash className="text-white" />
              </button>
            </div>
          ) : (
            <div className="relative h-full aspect-[3/4] flex items-center justify-center border-ui-border-strong rounded-lg border border-dashed p-2">
              <p className="text-center">No any Image Uploaded</p>
            </div>
          )}
        </>
      )}
      <div
        onClick={() => inputRef?.current?.click()}
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
        className={clsx(
          "h-full bg-ui-bg-component border-ui-border-strong transition-fg group flex w-full items-center justify-center gap-y-2 rounded-lg border border-dashed py-4 px-8 hover:border-ui-border-interactive focus:border-ui-border-interactive focus:shadow-borders-focus outline-none focus:border-solid cursor-pointer",
          className
        )}
      >
        {selectedImage ? (
          <div className="relative h-full">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full max-w-48 h-full object-container rounded"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
                onChange([]);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 focus:outline-none"
            >
              <XMark className="text-white" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p>{text}</p>
            {placeholder}
          </div>
        )}
        {fileUploadError && (
          <span className="text-rose-60">
            {errorMessage || "Please upload an image file"}
          </span>
        )}
        <input
          ref={inputRef}
          accept={filetypes.join(", ")}
          multiple={multiple}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default FileUploadField;
