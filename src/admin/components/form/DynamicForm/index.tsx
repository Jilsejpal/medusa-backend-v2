import { Controller, FieldValues, UseFormReturn } from "react-hook-form";
import React, { memo } from "react";
import getInputElement from "../getInputElement";
import { Input, Label, clx, Button } from "@medusajs/ui";
import ErrorMessage from "./ErrorMessage";

type SchemaField = {
  label?: string;
  fieldType: string;
  props?: any;
  validation: Record<string, any>;
};

type Props = {
  form: UseFormReturn<FieldValues, any, undefined>;
  onSubmit: (data: FieldValues) => void;
  onReset?: () => void;
  schema: Record<string, SchemaField>;
};

const DynamicForm = ({ form, onSubmit, onReset, schema }: Props) => {
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-y-3"
    >
      {Object.entries(schema).map(([key, fields]) => {
        console.log(fields.validation, "validation");

        return (
          <Controller
            key={key}
            control={form.control}
            name={key}
            rules={fields.validation}
            render={({ field }) => {
              console.log("====================================");
              console.log(fields.validation);
              console.log("====================================");
              return (
                <div>
                  <Label htmlFor={key}>
                    <span
                      className={clx("font-medium font-sans block mb-2", {
                        ["sr-only"]: !fields.label,
                      })}
                    >
                      {fields.label || field.name}
                    </span>
                    {React.createElement(
                      getInputElement(fields.fieldType) as typeof Input,
                      {
                        ...fields.props,
                        ...field,
                      }
                    )}
                    <ErrorMessage
                      control={form.control}
                      name={key}
                      rules={fields.validation}
                    />
                  </Label>
                </div>
              );
            }}
          />
        );
      })}
      <div className="flex gap-4 items-center">
        <Button
          type="submit"
          disabled={form.formState.isLoading || form.formState.isSubmitting}
        >
          {form.formState.isLoading || form.formState.isSubmitting
            ? "Submitting..."
            : "Submit"}
        </Button>
        {onReset && (
          <Button
            type="button"
            variant="secondary"
            disabled={form.formState.isLoading || form.formState.isSubmitting}
            onClick={onReset}
          >
            Reset
          </Button>
        )}
      </div>
    </form>
  );
};

export default memo(DynamicForm);
